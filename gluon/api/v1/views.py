from rest_framework.pagination import LimitOffsetPagination
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.throttling import ScopedRateThrottle

from gluon.anacreon.models import Business, BusinessUser, Category, SubCategory, Item, ItemImage, Stock, Expenditure, Order, OrderItem
from gluon.api.helper import APISessionAuthentication, APIBasicAuthentication
from gluon.api.v1.serializers import (
    BusinessReadSerializer, BusinessWriteSerializer,
    BusinessUserReadSerializer, BusinessUserWriteSerializer,
    CategoryReadSerializer, CategoryWriteSerializer,
    SubCategoryReadSerializer, SubCategoryWriteSerializer,
    ItemReadSerializer, ItemWriteSerializer,
    ItemImageReadSerializer, ItemImageWriteSerializer,
    StockReadSerializer, StockWriteSerializer,
    ExpenditureReadSerializer, ExpenditureWriteSerializer,
    OrderReadSerializer, OrderWriteSerializer,
    OrderItemReadSerializer, OrderItemWriteSerializer,
)
from gluon.api.views import BaseAPIView, ListAPIMixin, WriteAPIMixin


class BaseEndpoint(BaseAPIView):
    """
    Base class of all our API V2 endpoints
    """

    authentication_classes = (APISessionAuthentication, APIBasicAuthentication)
    permission_classes = ()
    renderer_classes = (JSONRenderer, BrowsableAPIRenderer)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "v1"


class BusinessEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = Business
    write_serializer_class = BusinessWriteSerializer
    serializer_class = BusinessReadSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = super().get_queryset()

        return queryset.filter(is_active=True)

    def filter_queryset(self, queryset):
        params = self.request.query_params

        gid = params.get('name')

        # Filter by group
        if gid is not None:
            queryset = queryset.filter(gid=gid)

        # setup filter by before/after on start_date
        return self.filter_before_after(queryset, "created_on")


class BusinessUserEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = BusinessUser
    write_serializer_class = BusinessUserWriteSerializer
    serializer_class = BusinessUserReadSerializer
    pagination_class = LimitOffsetPagination

class CategoryEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = Category
    write_serializer_class = CategoryWriteSerializer
    serializer_class = CategoryReadSerializer
    pagination_class = LimitOffsetPagination

class SubCategoryEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = SubCategory
    write_serializer_class = SubCategoryWriteSerializer
    serializer_class = SubCategoryReadSerializer
    pagination_class = LimitOffsetPagination

class ItemEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = Item
    write_serializer_class = ItemWriteSerializer
    serializer_class = ItemReadSerializer
    pagination_class = LimitOffsetPagination

class ItemImageEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = ItemImage
    write_serializer_class = ItemImageWriteSerializer
    serializer_class = ItemImageReadSerializer
    pagination_class = LimitOffsetPagination

class StockEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = Stock
    write_serializer_class = StockWriteSerializer
    serializer_class = StockReadSerializer
    pagination_class = LimitOffsetPagination

class ExpenditureEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = Expenditure
    write_serializer_class = ExpenditureWriteSerializer
    serializer_class = ExpenditureReadSerializer
    pagination_class = LimitOffsetPagination

class OrderEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = Order
    write_serializer_class = OrderWriteSerializer
    serializer_class = OrderReadSerializer
    pagination_class = LimitOffsetPagination

class OrderItemEndPoint(ListAPIMixin, WriteAPIMixin, BaseEndpoint):
    model = OrderItem
    write_serializer_class = OrderItemWriteSerializer
    serializer_class = OrderItemReadSerializer
    pagination_class = LimitOffsetPagination
