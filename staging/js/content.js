/* ==========================================================================
   CONTENT FILE - all the wording lives here.

   For the counsellor reviewing this: you can change any text between the
   quote marks ("like this"). Please keep the quote marks, and the commas
   at the ends of lines, exactly as they are. If a sentence needs a quote
   mark inside it, use an apostrophe (') rather than a double quote (").

   {name} is replaced with the pet's name if the visitor typed one (only
   used in thanksNamed below). {them} can also be used in any text: it
   becomes the pet's name, or the word "them" if no name was given.

   Nothing in this file is stored or sent anywhere. It is only shown on the
   page.
   ========================================================================== */

window.LDC_CONTENT = {

  /* ---- Teaser (the small collapsed box, shown instead of the opening
     screen when the widget starts collapsed - see config.js). Keep this
     short: it's meant to declutter a busy page like the homepage. Clicking
     the button reveals the opening screen below. ---- */
  teaser: {
    heading: "Grieving the loss of a pet?",
    body: "A short, private check-in can help you reflect on how you've been feeling since your loss. It takes about 2 minutes.",
    button: "Start the check-in"
  },

  /* ---- Opening screen ---- */
  intro: {
    kicker: "A gentle check-in",
    title: "Missing a much-loved pet?",
    body: [
      "We form deep, meaningful connections with our animals, and when they're no longer with us their absence can feel enormous.",
      "Six short questions can help you pause and notice how you've been feeling since your loss. This isn't a test and there are no right or wrong answers. It takes about 2 minutes."
    ],
    nameLabel: "Their name (optional)",
    nameHint: "Only used on this page, in your reflection at the end.",
    privacy: "Everything stays on your device. Nothing you choose or type here is saved, sent or tracked.",
    startButton: "Begin"
  },

  /* ---- Questions ----
     "prompt" is shown above every statement.
     "statements" are the things to reflect on, one per screen.
     "reflection" is a kind sentence that may appear in the results if the
     visitor felt this statement was true for them.
     "section" is the heading in the blog post that speaks to this question
     (two questions can share one; it's only shown once).
     It's shown on the results screen as a reason to read the post, so it
     must match a heading that really is in the post.
     You can add, remove or reorder questions freely (about 5 to 8 works well). */
  questions: {
    prompt: "Lately, how true does this feel for you?",
    options: [
      { label: "Not really", points: 0 },
      { label: "Sometimes",  points: 1 },
      { label: "Often",      points: 2 }
    ],
    items: [
      {
        statement: "My grief feels bigger than I expected it to.",
        reflection: "Grief after losing an animal can be as deep as any loss. It reflects how much they meant to you.",
        section: "Why pet loss hurts so much"
      },
      {
        statement: "I feel I have to hide or play down my grief around other people.",
        reflection: "Having to hide your grief can make it feel heavier, and lonelier.",
        section: "When others don't understand"
      },
      {
        statement: "I find myself caught up in guilt or 'what ifs'.",
        reflection: "Guilt and 'what ifs' are very common in grief, especially when you've had to make difficult decisions.",
        section: "The emotional complexity of pet loss"
      },
      {
        statement: "I've felt angry, numb or overwhelmed, sometimes all in the same day.",
        reflection: "Grief isn't only sadness. Anger, numbness and confusion are all part of it too.",
        section: "The emotional complexity of pet loss"
      },
      {
        statement: "Grief has been affecting my sleep, concentration or energy.",
        reflection: "Grief can affect the body and mind as well as the heart.",
        section: "Finding support through grief"
      },
      {
        statement: "I feel I should be 'over it' by now.",
        reflection: "There's no timetable for grief, and no right way to feel.",
        section: "Grief has no timeline"
      }
    ],
    backButton: "Back",
    progressLabel: "Question {current} of {total}"
  },

  /* ---- Result messages ----
     Which message appears depends on how the visitor answered. No score or
     label is ever shown to them. "minPoints" is the lowest total (Not really = 0,
     Sometimes = 1, Often = 2, added up) at which that message is used. With six
     questions the total runs from 0 to 12. Keep the first one at 0. */
  results: {
    thanksNamed: "Thank you for taking a moment for {name}.",
    thanks: "Thank you for taking a moment for yourself.",
    reflectionsHeading: "Some things you shared",
    bands: [
      {
        minPoints: 0,
        title: "It sounds like you're finding your way through",
        body: [
          "Your answers suggest you're coping with your loss in your own way at the moment, and that's worth noticing.",
          "Grief can come and go, and it can return when you least expect it. If it ever feels heavier, talking it through with someone can help."
        ]
      },
      {
        minPoints: 4,
        title: "It sounds like this loss is weighing on you",
        body: [
          "Your answers suggest that losing your pet has been affecting you, and that's completely understandable. They were part of your life and your family.",
          "Talking with someone who takes your grief seriously, and listens without judgement, can help you make sense of what you're feeling."
        ]
      },
      {
        minPoints: 8,
        title: "It sounds like your grief has been very heavy",
        body: [
          "Thank you for taking the time to reflect. Your answers suggest this loss has been really hard, and your grief deserves care and attention.",
          "You don't have to carry it alone. Counselling can offer a steady, confidential space to remember them and to be listened to at your own pace."
        ]
      }
    ],
    disclaimer: "This reflection isn't a diagnosis or an assessment. It's just a gentle prompt, and only you know what's right for you.",
    restartButton: "Start again"
  },

  /* ---- The blog post (the link itself is set in config.js) ----
     "sectionsIntro" is followed by the blog headings that match the
     visitor's answers (see "section" on each question above). */
  blog: {
    kicker: "Read more from Liane",
    title: "Grieving after the loss of a pet",
    quote: "It takes time to adjust to a world that suddenly looks and feels different.",
    sectionsIntro: "In the post, Liane writes about things you mentioned:",
    sectionsIntroGeneral: "In the post, Liane writes about:",
    personal: "She also shares her own loss of Buddy, her much-loved black lab.",
    button: "Read the blog post"
  },

  /* ---- Breathing pause (shown on the results screen) ---- */
  breathing: {
    heading: "Would a minute to breathe help?",
    intro: "A slow breath out can help your body settle. Follow the circle, or just the words.",
    startButton: "Take a one-minute breathing pause",
    stopButton: "Stop",
    againButton: "Do it again",
    breatheIn: "Breathe in…",
    breatheOut: "Breathe out…",
    done: "Notice how you feel now.",
    stopped: "That's fine. You can come back to this whenever you like.",
    /* Read out by screen readers */
    announceStart: "Breathing pause started.",
    announceDone: "Breathing pause finished."
  },

  /* ---- Call to action (the button link itself is set in config.js) ---- */
  cta: {
    heading: "If you'd like to talk",
    body: "A free introductory call is a chance to say hello, ask any questions and get a feel for whether working together could suit you. There's no pressure and no commitment.",
    button: "Book a free introductory call"
  },

  /* ---- Other pet bereavement support (shown on the results screen).
     This is not urgent help: that's the crisis section below. Please check
     these details are still correct from time to time. To hide this
     section, delete everything between the square brackets of services. ---- */
  support: {
    heading: "Other support after losing a pet",
    services: [
      { name: "Blue Cross Pet Bereavement Support", detail: "free and confidential, 8.30am to 8.30pm every day", phone: "0800 096 6606" }
    ]
  },

  /* ---- Crisis support: shown on every screen, including every result.
     Please check these are still correct from time to time. ---- */
  crisis: {
    heading: "If you urgently need support right now",
    intro: "Please contact one of the following:",
    services: [
      { name: "Samaritans", detail: "free, any time, day or night", phone: "116 123" },
      { name: "NHS 111",    detail: "for urgent help that isn't an emergency", phone: "111" },
      { name: "999",        detail: "in an emergency, or if you or someone else is in immediate danger", phone: "999" }
    ]
  },

  /* ---- Small print for screen readers / page ---- */
  page: {
    iframeTitle: "A gentle check-in after losing a pet",
    noScript: "This check-in needs JavaScript to run. If you'd like to talk to someone, please get in touch using the contact details on this website."
  }
};
