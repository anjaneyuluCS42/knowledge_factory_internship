from celery_worker import celery_app
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

@celery_app.task
def send_welcome_email(name, receiver_email):

    sender_email = os.getenv("EMAIL")

    app_password = os.getenv("APP_PASSWORD")

    subject = "Welcome 🎉 Registration Successful"

    body = f"""
    Hi {name},

    Thank you for registering with our platform.

    We are excited to have you onboard 🚀

    Regards,
    Anji Team
    """

    msg = MIMEText(body)

    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:

        server = smtplib.SMTP("smtp.gmail.com", 587)

        server.starttls()

        server.login(sender_email, app_password)

        server.sendmail(
            sender_email,
            receiver_email,
            msg.as_string()
        )

        server.quit()

        print("Email sent successfully!")

        return "SUCCESS"

    except Exception as e:

        print("Email failed:", e)

        return "FAILED"