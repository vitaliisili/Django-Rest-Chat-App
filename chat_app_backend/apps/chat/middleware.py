from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from oauth2_provider.models import AccessToken
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs


@database_sync_to_async
def get_user(scope):
    user = None

    query_string = scope.get('query_string').decode()
    params = parse_qs(query_string)
    token_key = params.get('token')[0]
    print("TOKEN_KEY", token_key)

    if token_key is not None and token_key != "":
        token = AccessToken.objects.get(token=token_key)
        print('TOKEN_IS', token)
        token_valid = token.is_valid()
        print("TOKEN_VALID", token_valid)
        if token_valid:
            print("TOKEN_VALID", token_valid)
            user = token.user

    return user or AnonymousUser()


class TokenAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        scope['user'] = await get_user(scope)
        return await super().__call__(scope, receive, send)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
