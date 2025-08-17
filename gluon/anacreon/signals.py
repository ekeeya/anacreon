from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Stock, Expenditure, AuditLog, Order


def get_audit_details(instance, action):
    if isinstance(instance, Stock):
        return {
            "item": instance.item.name,
            "quantity": instance.quantity,
            "cost_price": str(instance.cost_price),
            "selling_price": str(instance.selling_price),
        }
    elif isinstance(instance, Order):
        return {
            "status": instance.status,
            "total": str(instance.total),
            "items": [
                {
                    "item": oi.item.name,
                    "quantity": oi.quantity,
                    "selling_price": str(oi.selling_price),
                } for oi in instance.items.all()
            ],
            "customer": getattr(instance.customer, 'username', None),
        }

    elif isinstance(instance, Expenditure):
        return {
            "amount": str(instance.amount),
            "category": instance.category,
            "description": instance.description,
        }
    return {}


@receiver(post_save, sender=Stock)
def log_stock_save(sender, instance, created, **kwargs):
    action = "create" if created else "update"
    AuditLog.objects.create(
        business=instance.item.business,
        user=instance.recorded_by,
        action=action,
        model="Stock",
        object_id=instance.id,
        details=get_audit_details(instance, action),
    )


@receiver(post_delete, sender=Stock)
def log_stock_delete(sender, instance, **kwargs):
    AuditLog.objects.create(
        business=instance.item.business,
        user=instance.recorded_by,
        action="delete",
        model="Stock",
        object_id=instance.id,
        details=get_audit_details(instance, "delete"),
    )


@receiver(post_save, sender=Expenditure)
def log_expenditure_save(sender, instance, created, **kwargs):
    action = "create" if created else "update"
    AuditLog.objects.create(
        business=instance.business,
        user=instance.spent_by,
        action=action,
        model="Expenditure",
        object_id=instance.id,
        details=get_audit_details(instance, action),
    )


@receiver(post_delete, sender=Expenditure)
def log_expenditure_delete(sender, instance, **kwargs):
    AuditLog.objects.create(
        business=instance.business,
        user=instance.spent_by,
        action="delete",
        model="Expenditure",
        object_id=instance.id,
        details=get_audit_details(instance, "delete"),
    )


@receiver(post_save, sender=Order)
def log_order_save(sender, instance, created, **kwargs):
    action = "create" if created else "update"
    AuditLog.objects.create(
        business=instance.business,
        user=instance.placed_by,
        action=action,
        model="Order",
        object_id=instance.id,
        details=get_audit_details(instance, action),
    )


@receiver(post_delete, sender=Order)
def log_order_delete(sender, instance, **kwargs):
    AuditLog.objects.create(
        business=instance.business,
        user=instance.placed_by,
        action="delete",
        model="Order",
        object_id=instance.id,
        details=get_audit_details(instance, "delete"),
    )
