const templates = [
  {
    id: 'cold_intro',
    name: 'Cold Introduction',
    stage: 'new',
    subject: 'Quick question about {{company}}\'s payment infrastructure',
    body: `Hi {{firstName}},

I noticed {{company}} is doing impressive work in the payments space. We've been helping companies like yours streamline cross-border settlements with near-instant USDC-to-fiat conversion.

Companies using our offramp protocol have seen:
- 99.9% settlement success rate
- Average 4.2s settlement time
- Significant reduction in FX fees

Would you be open to a 15-minute call this week to explore if this could help {{company}}?

Best regards`,
  },
  {
    id: 'follow_up_1',
    name: 'First Follow-Up',
    stage: 'new',
    subject: 'Re: {{company}} payment infrastructure',
    body: `Hi {{firstName}},

I reached out last week about how our settlement protocol could help {{company}} reduce cross-border payment costs.

I understand you're busy, so I'll keep this brief: we recently helped a similar company cut their settlement time from 3 days to under 5 seconds.

Would a quick 10-minute demo be worth your time?

Best regards`,
  },
  {
    id: 'value_prop',
    name: 'Value Proposition',
    stage: 'contacted',
    subject: 'How {{company}} could save on cross-border settlements',
    body: `Hi {{firstName}},

Thanks for your interest in our protocol. Here's a quick breakdown of what we could offer {{company}}:

1. Instant Settlement: USDC to local currency in ~4.2 seconds
2. Compliance-First: FIU-registered with full KYC/AML integration
3. Competitive Rates: Transparent pricing with no hidden fees
4. Developer-Friendly: RESTful API with SDKs for major platforms

Based on your current volume, we estimate {{company}} could save approximately 40-60% on settlement costs.

I'd love to walk you through a personalized demo. When works best for you?

Best regards`,
  },
  {
    id: 'case_study',
    name: 'Case Study Share',
    stage: 'qualified',
    subject: 'How [Similar Company] achieved 99.9% settlement rate',
    body: `Hi {{firstName}},

I thought you'd find this relevant: one of our clients in a similar space to {{company}} recently shared their results after 6 months on our platform:

- Settlement success rate: 99.9% (up from 94%)
- Average processing time: 4.2s (down from 72 hours)
- Monthly volume processed: $12M+
- Cost savings: 52% reduction in FX fees

They started with a pilot program processing $500K/month and scaled within 3 months.

Would you like me to set up a call with their team so you can hear about their experience firsthand?

Best regards`,
  },
  {
    id: 'proposal_intro',
    name: 'Proposal Introduction',
    stage: 'proposal',
    subject: 'Custom proposal for {{company}}',
    body: `Hi {{firstName}},

Following our conversation, I've put together a customized proposal for {{company}} that addresses your specific requirements:

Key highlights:
- Custom integration plan tailored to your existing stack
- Dedicated account manager for onboarding
- Volume-based pricing optimized for your projected throughput
- 24/7 technical support with <1 hour response SLA

I've attached the detailed proposal. I'd suggest we schedule a 30-minute call to walk through the numbers together and address any questions.

What does your availability look like this week?

Best regards`,
  },
  {
    id: 'negotiation_close',
    name: 'Closing Push',
    stage: 'negotiation',
    subject: 'Moving forward with {{company}} partnership',
    body: `Hi {{firstName}},

It's been great working through the details with you. I wanted to recap where we stand:

- We've aligned on the integration scope and timeline
- The pricing structure reflects {{company}}'s projected volume
- Our legal teams have reviewed the terms

To lock in the current pricing and priority onboarding slot, I'd recommend we finalize the agreement by end of this week. We have several enterprise clients in the queue, and I want to ensure {{company}} gets dedicated engineering support during integration.

Shall I send over the final agreement for signature?

Best regards`,
  },
  {
    id: 'breakup',
    name: 'Break-Up Email',
    stage: 'contacted',
    subject: 'Should I close your file?',
    body: `Hi {{firstName}},

I've reached out a few times about how our settlement protocol could help {{company}}, but I haven't heard back. I completely understand if the timing isn't right.

I'll go ahead and close your file for now, but if things change in the future, don't hesitate to reach out. The offer stands.

One last thought: we're currently offering early-access pricing for new enterprise partners. This expires at the end of the month if that influences timing at all.

Wishing you and {{company}} all the best.

Best regards`,
  },
  {
    id: 'referral_ask',
    name: 'Referral Request',
    stage: 'closed_won',
    subject: 'Quick favor, {{firstName}}?',
    body: `Hi {{firstName}},

I hope things have been going well since we started working together. Based on our conversations, it seems like the integration has been running smoothly for {{company}}.

I have a quick ask: do you know anyone in your network who might benefit from a similar solution? We've found that our best partnerships come from referrals from happy clients like yourself.

If anyone comes to mind, I'd really appreciate an introduction. Of course, we have a referral program that rewards you for successful introductions.

Thanks for being a great partner!

Best regards`,
  },
];

function fillTemplate(template, lead) {
  const firstName = (lead.name || '').split(' ')[0] || 'there';
  const company = lead.company || 'your company';

  let subject = template.subject;
  let body = template.body;

  subject = subject.replace(/\{\{firstName\}\}/g, firstName).replace(/\{\{company\}\}/g, company);
  body = body.replace(/\{\{firstName\}\}/g, firstName).replace(/\{\{company\}\}/g, company);

  return { subject, body };
}

function getTemplatesForStage(stage) {
  return templates.filter((t) => t.stage === stage);
}

export { templates, fillTemplate, getTemplatesForStage };
