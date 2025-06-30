from collections import deque
from pydantic import BaseModel


class EventModel(BaseModel):
    percentage: int
    message: str




class SSEEvent:
    EVENTS = deque()

    @staticmethod
    def add_event(event: EventModel):
        SSEEvent.EVENTS.append(event)

    @staticmethod
    def get_event():
        if len(SSEEvent.EVENTS) > 0:
            temp = SSEEvent.EVENTS.popleft()
            return temp
        return None

