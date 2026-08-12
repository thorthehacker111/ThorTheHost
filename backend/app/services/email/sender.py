import logging
from sqlalchemy.orm import Session
from app.models.alias import Alias
from app.models.log import EmailLog
from app.models.user import User

logger = logging.getLogger(__name__)


class EmailSender:
    """
    Base abstraction for sending emails.
    """
    def __init__(self, db: Session):
        self.db = db

    def process_incoming_email(self, recipient_alias: str, sender_email: str, subject: str, body: str):
        """
        Validates the alias and routes the email or drops it, logging the outcome.
        """
        alias = self.db.query(Alias).filter(Alias.alias == recipient_alias).first()

        if not alias:
            logger.warning(f"Email sent to non-existent alias: {recipient_alias}")
            return

        user = self.db.query(User).filter(User.id == alias.user_id).first()

        # Check conditions
        if alias.status == "deleted":
            self._log_email(alias.id, sender_email, "blocked", "Alias is deleted")
            return

        if alias.status == "disabled":
            self._log_email(alias.id, sender_email, "blocked", "Alias is disabled")
            return

        if user.status != "active":
            self._log_email(alias.id, sender_email, "blocked", "User account inactive")
            return

        # Block forwarding until the user has verified their forwarding email
        if not user.is_forward_verified:
            self._log_email(alias.id, sender_email, "blocked", "Forwarding email not verified")
            logger.info(
                f"Blocked forwarding for alias {recipient_alias} — "
                f"user {user.username} has not verified their forwarding email."
            )
            return

        # Forward the email
        try:
            self._send(user.forward_email, sender_email, subject, body)
            alias.mail_count += 1
            self._log_email(alias.id, sender_email, "forwarded", None)
            self.db.commit()
        except Exception as e:
            logger.error(f"Failed to forward email: {e}")
            self._log_email(alias.id, sender_email, "bounced", str(e))
            self.db.commit()

    def _send(self, to_email: str, from_email: str, subject: str, body: str):
        raise NotImplementedError

    def _log_email(self, alias_id: int, sender: str, status: str, error_message: str = None):
        log = EmailLog(
            alias_id=alias_id,
            sender=sender,
            status=status,
            error_message=error_message
        )
        self.db.add(log)


import smtplib
from email.message import EmailMessage
from app.core.config import settings


class MockEmailSender(EmailSender):
    """
    Pretends to send an email — useful during local development without SMTP.
    """
    def _send(self, to_email: str, from_email: str, subject: str, body: str):
        logger.info(f"[MOCK SMTP] Forwarding email from {from_email} to {to_email} (Subject: {subject})")


class LiveEmailSender(EmailSender):
    """
    Sends emails via the configured upstream SMTP relay (e.g. SendGrid).
    """
    def _send(self, to_email: str, from_email: str, subject: str, body: str):
        msg = EmailMessage()
        msg.set_content(f"--- Forwarded message from {from_email} ---\n\n{body}")

        msg['Subject'] = f"[ThorTheHost] {subject}"
        msg['From'] = settings.smtp_from_email
        msg['To'] = to_email
        msg['Reply-To'] = from_email

        logger.info(f"Forwarding live email to {to_email} via {settings.smtp_host}")

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            if settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
