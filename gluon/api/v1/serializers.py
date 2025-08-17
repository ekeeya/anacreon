import logging

from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from gluon.anacreon.models import Business, BusinessUser, Category, SubCategory, Item, ItemImage, Stock, Expenditure, \
    Order, OrderItem
from gluon.utils import json
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)


def format_datetime(value):
    """

    :param value:
    :return:
    """
    return json.encode_datetime(value, micros=True) if value else None


class ReadSerializer(serializers.ModelSerializer):
    """
    Serializer that serializes Read objects. separation of logic, DFR uses the same serializer class for both read and write
    """

    def save(self, **kwargs):
        raise ValueError("Can't call save on a read serializer")


class WriteSerializer(serializers.Serializer):
    """
        DRF uses the view to decide if it's an update or new instance. Let's have the serializer do it.
    """

    def run_validation(self, data=serializers.empty):
        if not isinstance(data, dict):
            raise serializers.ValidationError(
                detail={"non_field_errors": ["Request body must be a single JSON object"]}
            )

        if not self.context["user"].is_active:
            raise serializers.ValidationError(detail={"non_field_errors": ["User must be active"]})

        return super().run_validation(data)


class BusinessReadSerializer(ReadSerializer):
    class Meta:
        model = Business
        fields = (
            "id",
            "name",
            "description",
            "created_at",
            "updated_at",
        )


class BusinessWriteSerializer(WriteSerializer):
    name = serializers.CharField(required=True)

    def validate_name(self, value):
        if Business.objects.filter(gid=value).exists():
            raise serializers.ValidationError(f"Business with name {value} already exist.")

        return value

    def save(self, **kwargs):
        form_data = self.validated_data
        if self.instance:
            return self.instance.update(form_data)
        else:
            return Business.create(**form_data)


class BusinessUserReadSerializer(ReadSerializer):
    class Meta:
        model = BusinessUser
        fields = ("id", "user", "business", "is_admin", "joined_at")


class BusinessUserWriteSerializer(WriteSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())
    is_admin = serializers.BooleanField(default=False)

    def save(self, **kwargs):
        return BusinessUser.objects.create(**self.validated_data)


class CategoryReadSerializer(ReadSerializer):
    class Meta:
        model = Category
        fields = ("id", "business", "name", "description")


class CategoryWriteSerializer(WriteSerializer):
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)

    def save(self, **kwargs):
        return Category.objects.create(**self.validated_data)


class SubCategoryReadSerializer(ReadSerializer):
    class Meta:
        model = SubCategory
        fields = ("id", "category", "name", "description")


class SubCategoryWriteSerializer(WriteSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)

    def save(self, **kwargs):
        return SubCategory.objects.create(**self.validated_data)


class ItemReadSerializer(ReadSerializer):
    class Meta:
        model = Item
        fields = ("id", "business", "category", "subcategory", "name", "description", "sku", "properties", "cost_price",
                  "last_selling_price", "quantity", "weight")


class ItemWriteSerializer(WriteSerializer):
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False, allow_null=True)
    subcategory = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), required=False,
                                                     allow_null=True)
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    sku = serializers.CharField(required=False, allow_blank=True)
    properties = serializers.JSONField(required=False)
    cost_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    last_selling_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
    quantity = serializers.IntegerField(required=False)
    weight = serializers.IntegerField(required=False)

    def save(self, **kwargs):
        return Item.objects.create(**self.validated_data)


class ItemImageReadSerializer(ReadSerializer):
    class Meta:
        model = ItemImage
        fields = ("id", "item", "image", "mimetype", "color")


class ItemImageWriteSerializer(WriteSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    image = serializers.CharField()  # base64 string
    mimetype = serializers.CharField()
    color = serializers.CharField(required=False, allow_blank=True)

    def save(self, **kwargs):
        return ItemImage.objects.create(**self.validated_data)


class StockReadSerializer(ReadSerializer):
    class Meta:
        model = Stock
        fields = ("id", "item", "quantity", "cost_price", "selling_price", "recorded_by", "recorded_at")


class StockWriteSerializer(WriteSerializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    quantity = serializers.IntegerField()
    cost_price = serializers.DecimalField(max_digits=12, decimal_places=2)
    selling_price = serializers.DecimalField(max_digits=12, decimal_places=2)

    def save(self, **kwargs):
        return Stock.record_stock(
            item=self.validated_data["item"],
            quantity=self.validated_data["quantity"],
            cost_price=self.validated_data["cost_price"],
            selling_price=self.validated_data["selling_price"]
        )


class ExpenditureReadSerializer(ReadSerializer):
    class Meta:
        model = Expenditure
        fields = ("id", "business", "amount", "description", "category", "spent_by", "spent_at")


class ExpenditureWriteSerializer(WriteSerializer):
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    description = serializers.CharField()
    category = serializers.CharField()

    def save(self, **kwargs):
        return Expenditure.record_expenditure(
            business=self.validated_data["business"],
            amount=self.validated_data["amount"],
            description=self.validated_data["description"],
            category=self.validated_data["category"]
        )


class OrderItemReadSerializer(ReadSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "order", "item", "quantity", "selling_price")


class OrderItemWriteSerializer(WriteSerializer):
    order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all())
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())
    quantity = serializers.IntegerField()
    selling_price = serializers.DecimalField(max_digits=12, decimal_places=2)

    def save(self, **kwargs):
        return OrderItem.objects.create(**self.validated_data)


class OrderReadSerializer(ReadSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
        "id", "business", "status", "placed_at", "completed_at", "cancelled_at", "placed_by", "customer", "notes",
        "total", "items")


class OrderWriteSerializer(WriteSerializer):
    business = serializers.PrimaryKeyRelatedField(queryset=Business.objects.all())
    customer = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), required=False,
                                                  allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(child=serializers.DictField(), required=True)

    def save(self, **kwargs):
        # Create order
        order = Order.objects.create(
            business=self.validated_data["business"],
            customer=self.validated_data.get("customer"),
            notes=self.validated_data.get("notes", "")
        )
        # Create order items
        for item_data in self.validated_data["items"]:
            OrderItem.objects.create(
                order=order,
                item=item_data["item"],
                quantity=item_data["quantity"],
                selling_price=item_data["selling_price"]
            )
        order.calculate_total()
        return order
