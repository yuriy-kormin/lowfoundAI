import graphene
from graphene_django import DjangoObjectType
from django.db.models import Q

from .models import Message
from .remote_api import get_AI_response


class MessageNode(DjangoObjectType):
    date = graphene.String()

    class Meta:
        model = Message

    def resolve_date(self, info):
        return self.date.strftime('%d %B %Y %H:%M')


class Query(graphene.ObjectType):
    history = graphene.List(MessageNode)

    def resolve_history(self, info):
        return Message.objects.select_related('user').filter(
            Q(user=info.context.user) &
            Q(is_deleted=False)
        )


class RemoveMessageMutation(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    def mutate(self, info, id):
        try:
            instance = Message.objects.get(id=id)
            instance.is_deleted = True
            instance.save()
            success = True
        except Message.DoesNotExist:
            success = False

        return RemoveMessageMutation(success=success)


class CreateMessageMutation(graphene.Mutation):
    class Arguments:
        request = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.Field(MessageNode)

    def mutate(self, info, request):
        response = str(get_AI_response(request))
        instance = Message.objects.create(
            user=info.context.user,
            request=request,
            response=response
        )
        success = True
        return CreateMessageMutation(success=success, message=instance)


class Mutation(graphene.ObjectType):
    remove_message = RemoveMessageMutation.Field()
    create_message = CreateMessageMutation.Field()
