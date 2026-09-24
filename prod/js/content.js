/* ==========================================================================
   CONTENT FILE - all the wording lives here.

   For the counsellor reviewing this: you can change any text between the
   quote marks ("like this"). Please keep the quote marks, and the commas
   at the ends of lines, exactly as they are. If a sentence needs a quote
   mark inside it, use an apostrophe (') rather than a double quote (").

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
    title: "Take a moment for yourself",
    body: [
      "Losing a pet can mean losing a companion, a daily routine and a source of comfort all at once. The grief that follows is real, even when other people don't always see it.",
      "This isn't a test. There are no right or wrong answers. It takes about 2 minutes to do."
    ],
    privacy: "Everything stays on your device. Nothing you choose here is saved, sent or tracked.",
    startButton: "Begin"
  },

  /* ---- Questions ----
     "prompt" is shown above every statement.
     "statements" are the things to reflect on, one per screen.
     "reflection" is a kind sentence that may appear in the results if the
     visitor felt this statement was true for them.
     You can add, remove or reorder questions freely (about 5 to 8 works well). */
  questions: {
    prompt: "Lately, how true does this feel for you?",
    options: [
      { label: "Not really", points: 0 },
      { label: "Sometimes",  points: 1 },
      { label: "Often",      points: 2 }
    ],
    unansweredHint: "There is no right or wrong answer",
    items: [
      {
        statement: "I miss them in a way that's hard to put into words.",
        reflection: "The bond with an animal is real, and so is the grief when they're gone."
      },
      {
        statement: "I feel that other people don't really understand how much this loss means to me.",
        reflection: "When others don't see the size of a loss, grief can feel very lonely."
      },
      {
        statement: "I keep going over decisions I made, or wondering if I could have done something differently.",
        reflection: "Guilt and 'what ifs' are very common after losing a pet, especially when you've had to make difficult decisions for them."
      },
      {
        statement: "Home, or my daily routine, feels empty without them.",
        reflection: "Losing the routines you shared can leave a gap in every part of the day."
      },
      {
        statement: "I've been finding it hard to sleep, concentrate or get through the day.",
        reflection: "Grief can affect the body and mind as well as the heart."
      },
      {
        statement: "I feel like I should be 'over it' by now.",
        reflection: "There's no timetable for grief, and no right way to feel."
      }
    ],
    backButton: "Back",
    nextButton: "Next",
    finishButton: "See my reflection",
    progressLabel: "Question {current} of {total}"
  },

  /* ---- Result messages ----
     Which message appears depends on how the visitor answered. No score or
     label is ever shown to them. "minPoints" is the lowest total (Not really = 0,
     Sometimes = 1, Often = 2, added up) at which that message is used. With six
     questions the total runs from 0 to 12. Keep the first one at 0. */
  results: {
    reflectionsHeading: "Some things you told me",
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

  /* ---- Breathing pause (shown on the results screen) ---- */
  breathing: {
    heading: "Would a minute to breathe help first?",
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
    button: "Book a free introductory session"
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
