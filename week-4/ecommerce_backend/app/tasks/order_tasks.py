from app.tasks.celery_worker import celery

import time


@celery.task
def send_order_confirmation_email(
    email: str,
    order_id: int
):

    print(
        f"Sending email to {email}"
    )

    time.sleep(5)

    print(
        f"Order confirmation sent for order {order_id}"
    )

    return "Email Sent"