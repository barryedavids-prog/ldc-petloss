/* ==========================================================================
   CONFIG FILE - settings (not wording). Edited by the site owner.
   ========================================================================== */

window.LDC_CONFIG = {

  /* The blog post the results screen invites people to read. */
  blogUrl: "https://www.lianedavidscounselling.co.uk/blog/grieving-after-the-loss-of-a-pet",

  /* Where the "Book a free introductory call" button goes.
     Replace this placeholder with the real booking or contact page URL. */
  bookingUrl: "https://www.lianedavidscounselling.co.uk/home#contact",

  /* Breathing pause: seconds to breathe in, seconds to breathe out,
     and how many times to repeat. 4 + 6 seconds x 6 = one minute. */
  breathing: {
    inSeconds: 4,
    outSeconds: 6,
    cycles: 6
  },

  /* Pause (in milliseconds) after an answer is tapped before moving on to
     the next question, so the visitor sees their choice register. */
  advanceDelay: 380,

  /* Start as a small collapsed box (see content.js: teaser) instead of
     opening straight onto the first screen. Useful for a busy page like
     the homepage; leave false for a page whose only job is the check-in.
     This can be overridden per embed without changing this file, by adding
     ?start=collapsed or ?start=open to the iframe's src URL in
     docs/squarespace-embed.html. */
  startCollapsed: false
};
