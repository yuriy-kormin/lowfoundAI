import graphene as graphene
from lowfoundAI.chat.schema import Query as MessageQuery,\
    Mutation as MessageMutation


class Query(
    MessageQuery,
):
    pass


class Mutation(
    MessageMutation
):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
