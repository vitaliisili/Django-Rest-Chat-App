import requests
from drf_standardized_errors.handler import ExceptionHandler

from apps.core.exception.exception import ServiceUnavailable


class CustomExceptionHandler(ExceptionHandler):

    def convert_known_exceptions(self, exc: Exception) -> Exception:
        """Converts known exceptions to custom exceptions.

        This method is responsible for converting known exceptions to custom exceptions.
        If the provided exception is an instance of `requests.Timeout`, it returns a `ServiceUnavailable`
        exception. Otherwise, it delegates the conversion to the parent class by calling
        `super().convert_known_exceptions(exc)`.

        Args:
            exc (Exception): The exception to be converted.
        Returns:
            Exception: The converted exception.
        Raises:
            None
        """

        if isinstance(exc, requests.Timeout):
            return ServiceUnavailable()
        return super().convert_known_exceptions(exc)
