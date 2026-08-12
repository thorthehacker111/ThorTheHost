import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "What exactly is an alias?",
    answer:
      "An alias is a randomly generated address like forest_tiger4821@thorthehost.in. You give it out instead of your real email address. Anything sent to it is forwarded straight to your real inbox.",
  },
  {
    question: "Can I get my alias back after deleting it?",
    answer:
      "No, and that's intentional. Deleting an alias marks it as permanently retired so it can never be regenerated or reused by you or anyone else -- it simply stops receiving mail.",
  },
  {
    question: "Does the sender ever see my real email address?",
    answer:
      "No. Mail is forwarded server-side. The sender only ever sees the alias address, never your forwarding address.",
  },
  {
    question: "How many aliases can I create?",
    answer: "Every account can hold up to 500 active aliases at a time.",
  },
  {
    question: "Is my password stored securely?",
    answer:
      "Yes. Passwords are hashed with Argon2, a modern memory-hard hashing algorithm designed to resist brute-force and GPU-based cracking attempts. We never store or have access to your plain-text password.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-steel/60 py-24 sm:py-28">
      <div className="container max-w-3xl">
        <span className="font-mono text-xs uppercase tracking-widest text-lightning">FAQ</span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Questions, answered.
        </h2>

        <Accordion type="single" collapsible className="mt-10">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
