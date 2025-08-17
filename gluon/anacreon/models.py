from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone

try:
    from django.db.models import JSONField  # Django 3.1+
except ImportError:
    from django.contrib.postgres.fields import JSONField  # Older Django/Postgres

from gluon.utils.utils import get_current_user
from gluon.anacreon.base import SmartModel
import base64


class Business(SmartModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # created_at, updated_at, created_by, modified_by, etc. are inherited

    def __str__(self):
        return self.name

    @classmethod
    def create(cls, name, description="", is_admin=True):
        business = cls.objects.create(name=name, description=description)
        user = get_current_user()
        if user and user.is_authenticated and user.is_staff:
            BusinessUser.objects.create(
                user=user,
                business=business,
                is_admin=is_admin
            )
        return business


class BusinessUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='users')
    is_admin = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'business')

    def __str__(self):
        return f"{self.user.username} @ {self.business.name}"


class Category(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Item(SmartModel):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='items')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=100, blank=True, unique=True)
    properties = models.JSONField(default=dict, blank=True)
    cost_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    quantity = models.PositiveIntegerField(default=0)
    weight = models.PositiveIntegerField(default=0, help_text="Popularity weight for search ranking")

    # created_by, modified_by, etc. are inherited

    def __str__(self):
        return self.name

    def set_property(self, key, value):
        self.properties[key] = value
        self.save(update_fields=['properties'])

    def update_properties(self, **kwargs):
        self.properties.update(kwargs)
        self.save(update_fields=['properties'])

    def get_property(self, key, default=None):
        return self.properties.get(key, default)

    @classmethod
    def filter_by_property(cls, key, value):
        return cls.objects.filter(properties__has_key=key, properties__contains={key: value})


class ItemImage(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='images')
    image = models.TextField()
    mimetype = models.CharField(max_length=20)
    color = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Image for {self.item.name} ({self.color})"

    @classmethod
    def process_files(cls, files, color=None):
        """
        Accepts a file or list of files (Django UploadedFile or file-like objects),
        returns a list of dicts: {image: base64, mimetype: ..., color: ..., description: ...}
        """
        if not isinstance(files, (list, tuple)):
            files = [files]
        results = []
        for f in files:
            # Read file content and encode to base64
            content = f.read()
            if hasattr(f, 'content_type'):
                mimetype = f.content_type
            else:
                mimetype = 'application/octet-stream'
            b64 = base64.b64encode(content).decode('utf-8')
            result = {
                'image': b64,
                'mimetype': mimetype,
            }
            if color:
                result['color'] = color
            results.append(result)
        return results


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ("read", "Read"),
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
    ]
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="audit_logs")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    model = models.CharField(max_length=50)
    object_id = models.PositiveIntegerField()
    details = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} {self.action} {self.model} {self.object_id}"


# --- Business Logic for Stock, Sale, Expenditure ---

class Stock(SmartModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='stock_entries')
    quantity = models.IntegerField()
    cost_price = models.DecimalField(max_digits=12, decimal_places=2)
    selling_price = models.DecimalField(max_digits=12, decimal_places=2)
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    # created_by, modified_by, etc. are inherited

    def __str__(self):
        return f"{self.item.name} - {self.quantity} units"

    @classmethod
    def record_stock(cls, item, quantity, cost_price, selling_price):
        user = get_current_user()
        stock = cls.objects.create(
            item=item,
            quantity=quantity,
            cost_price=cost_price,
            selling_price=selling_price,
            recorded_by=user,
        )
        return stock

    def update_stock(self, quantity, cost_price=None, selling_price=None):
        self.quantity = quantity
        if cost_price is not None:
            self.cost_price = cost_price
        if selling_price is not None:
            self.selling_price = selling_price
        self.save()

    @classmethod
    def read_stock(cls, item, user=None):
        stock = cls.objects.filter(item=item).order_by('-recorded_at').first()
        return stock


class Expenditure(SmartModel):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='expenditures')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=255)
    spent_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    spent_at = models.DateTimeField(auto_now_add=True)

    # created_by, modified_by, etc. are inherited

    def __str__(self):
        return f"{self.category}: {self.amount} for {self.business.name}"

    @classmethod
    def record_expenditure(cls, business, amount, description, category):
        user = get_current_user()
        exp = cls.objects.create(
            business=business,
            amount=amount,
            description=description,
            category=category,
            spent_by=user,
        )
        return exp

    @classmethod
    def read_expenditure(cls, exp_id, user=None):
        exp = cls.objects.filter(id=exp_id).first()
        return exp


class OrderStatus:
    PENDING = 'pending'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    CHOICES = [
        (PENDING, 'Pending'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
    ]


class Order(SmartModel):
    business = models.ForeignKey(Business,
                                 on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=OrderStatus.CHOICES, default=OrderStatus.PENDING)
    placed_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    placed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders_placed')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='customer_orders')
    notes = models.TextField(blank=True)
    total = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    # created_by, modified_by, etc. are inherited

    def __str__(self):
        return f"Order #{self.id} for {self.business.name} ({self.status})"

    def calculate_total(self):
        total = sum([oi.quantity * oi.selling_price for oi in self.items.all()])
        self.total = total
        self.save(update_fields=['total'])
        return total

    def complete(self):
        self.status = OrderStatus.COMPLETED
        self.completed_at = timezone.now()
        self.save(update_fields=['status', 'completed_at'])

    def cancel(self):
        if self.status == OrderStatus.CANCELLED:
            return
        self.status = OrderStatus.CANCELLED
        self.cancelled_at = timezone.now()
        self.save(update_fields=['status', 'cancelled_at'])
        # Restock items
        for order_item in self.items.all():
            item = order_item.item
            item.quantity += order_item.quantity
            item.save(update_fields=['quantity'])

    def process_order(self):
        # Check stock for all items
        for order_item in self.items.all():
            if order_item.item.quantity < order_item.quantity:
                return {
                    'success': False,
                    'error': f"Item '{order_item.item.name}' is out of stock or insufficient quantity."
                }
        # All items in stock, process order
        for order_item in self.items.all():
            item = order_item.item
            item.quantity -= order_item.quantity
            item.weight += order_item.quantity  # Increase weight for popularity
            item.last_selling_price = order_item.selling_price
            item.save(
                update_fields=['quantity', 'weight', 'last_selling_price'])
        self.status = OrderStatus.COMPLETED
        self.completed_at = timezone.now()
        self.save(
            update_fields=['status', 'completed_at'])
        return {'success': True}


class OrderItem(models.Model):
    order = models.ForeignKey(Order,
                              on_delete=models.CASCADE,
                              related_name='items')
    item = models.ForeignKey(Item,
                             on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    selling_price = models.DecimalField(
        max_digits=12,
        decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.item.name} in Order #{self.order.id}"
