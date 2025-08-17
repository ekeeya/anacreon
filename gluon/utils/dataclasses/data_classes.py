from dataclasses import dataclass, is_dataclass, fields
from typing import Any


# https://www.geeksforgeeks.org/creating-nested-dataclass-objects-in-python/
def nested_dataclass(*args, **kwargs):
    def wrapper(check_class):

        # passing class to investigate
        check_class = dataclass(check_class, **kwargs)
        o_init = check_class.__init__

        def __init__(self, *args, **kwargs):

            for name, value in kwargs.items():

                # getting field type
                ft = check_class.__annotations__.get(name, None)

                if is_dataclass(ft) and isinstance(value, dict):
                    obj = ft(**value)
                    kwargs[name] = obj
                o_init(self, *args, **kwargs)

        check_class.__init__ = __init__

        return check_class

    return wrapper(args[0]) if args else wrapper


def as_dict(obj: Any) -> dict:
    """
    Convert a non-nested dataclass instance to a dictionary.

    Args:
        obj: A dataclass instance

    Returns:
        dict: A dictionary representation of the dataclass

    Raises:
        TypeError: If the input is not a dataclass instance
    """
    if not is_dataclass(obj):
        raise TypeError("Object must be a dataclass instance")

    return {field.name: getattr(obj, field.name) for field in fields(obj)}