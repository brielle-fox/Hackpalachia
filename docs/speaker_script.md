# CareBridge — Speaker Script (8 minutes + Q&A)

About 5 minutes of slides and 3 minutes of live demo, with a hard cap of **8:00**. One person presents and one person drives the demo. Speak to the judges; don't read the slides.

**Before you start:** demo tab open on Landing, **DemoPanel → Reset demo**, all four switches **off**, browser zoom at 125%, and backup screenshots on slide 5.

---

## 0:00 – 0:30 · Slide 1: Title

> "Right now, in a Facebook group somewhere in Appalachian Ohio, someone is typing: *'Does anyone know a doctor who's taking new patients?'*
>
> **For rural adults around Athens County, Ohio, CareBridge helps them get seen by a provider who is actually taking new patients, by replacing word of mouth with verified, up-to-date listings and library telehealth.**
>
> We're [team name]: [one breath per person, with their background]. We're in the Care Delivery track."

## 0:30 – 1:30 · Slide 2: The Problem

> "Finding a doctor here runs on word of mouth, and the answers are often out of date.
>
> In Meigs County there's one primary care physician for every **7,350** residents. Ohio's average is one for every **1,328**. In Vinton County it's one for every 6,348. *(County Health Rankings, 2025)*
>
> One of today's judges, who works in rural healthcare, told us people ask Facebook groups for a doctor and hear: *'there's one at so-and-so, but they don't take new patients.'*
>
> Here's the scale. Athens, Meigs and Vinton have about **23,100 adults aged 45 to 64**. Roughly one in five went a year without a checkup, so that's about **5,150 people**. That's our estimate, using the all-adult rate. And about **6,000 households** in those counties have no home internet, so a video visit at home isn't an option for them.
>
> So our solution has to do two things: show **current, trusted** availability, and work for people **without home internet**."

## 1:30 – 2:15 · Slide 3: Today's Journey

> "Meet Linda. She's a composite, not a real patient. She's 52, lives in Glouster, has Medicaid and type 2 diabetes, and her doctor just retired.
>
> When her refills run out, she asks a Facebook group and calls the names in her plan's directory. Two aren't taking patients, and the third is 50 minutes away. Video visits drop on her home connection. **That's the breakdown.** So she waits, her A1c climbs, and she ends up at urgent care or the ER.
>
> What we still need to verify: how often listings here are actually out of date. Our evidence on directory accuracy is national."

## 2:15 – 3:15 · Slide 4: Our Solution

> "CareBridge changes step three. Linda filters for 'accepting new patients' and 'Medicaid.' Every listing shows when it was **last confirmed**, who verified it, and what her neighbors say. She books. Because she has no internet at home, CareBridge offers her a **private telehealth room at the Glouster library**, with staff there to help her connect.
>
> On the provider side, her new clinic needs to give her a diabetic eye screening. It has the nurse and the exam room but no retinal camera. CareBridge matches it with a partner that has one: one trip covers several patients.
>
> A public operator, like a county health department, runs it. Providers confirm their listing with one tap each week, and libraries host the rooms. It asks almost nothing of Linda: any phone or a library computer, with no app, no cost, and no account needed to search. When something fails, stale listings get flagged, a cancelled partner gets re-matched, and anyone unsure can call a community health worker. **People make every clinical decision; the tool only suggests options.**"

## 3:15 – 6:15 · Slide 5: Prototype (live demo, 3:00)

Driver follows MASTER_PLAN.md Section 7. Presenter narrates **why**, not what's being clicked.

| Time | Beat | Say |
|---|---|---|
| 3:15 | **a. Find care**: Landing → Patient → Primary care + Accepting + Medicaid | "Instead of a Facebook group, Linda filters for who's actually taking patients and takes her insurance. These are real places around Athens." |
| 3:35 | Open Linda's clinic, then the stale listing | "*Confirmed 2 days ago*, verified by the county, and reviewed by neighbors. This one says *may be out of date*. That's the Facebook-group problem, flagged." |
| 3:55 | **b. Book**: connect patient portal (simulated) → Book | "She connects her existing patient portal so she doesn't retype her history. That part is simulated." |
| 4:10 | Flip **📶 No home internet** | "But Linda has no internet at home…" |
| 4:15 | Library banner → Book → text-message preview | "…so CareBridge offers a private telehealth room at the Glouster library, with someone to help, and confirms by plain text message." |
| 4:40 | **c. Provider**: switch to Hopewell The Plains → New requirement | "Now the clinic's side. Linda needs a diabetic eye screening. They have the nurse and the room, but no retinal camera, so they post exactly what they're missing." |
| 5:10 | Match → OhioHealth O'Bleness → Propose → Accepted | "The hub finds a partner with a portable camera and a technician. One trip covers a screening day for several patients." |
| 5:30 | **d. Flip ❄️ Partner cancelled** → Re-match → Hocking Valley | "Then it snows and the van can't make it. CareBridge re-matches to the next partner, and nobody is stranded." |
| 5:55 | **e. (optional)** `/kiosk` | "And this is the library computer: big buttons, a staff-help button, and nothing saved after she leaves." |
| 6:10 | Back to slides | "To be clear: the app and its logic are built and the locations are real. Availability, reviews and texts are simulated, and sign-in and the MyChart link are mocked." |

**If the demo breaks:** "Let me show you the same flow from our screenshots." Then walk the slide 5 storyboard. Never debug live.

## 6:15 – 7:00 · Slide 6: Assumptions & Risks

> "Our riskiest assumption: providers will confirm 'accepting new patients' every week. In the pilot we'd track the share of listings confirmed within seven days. At 80% or more by week eight, we keep going. Under 50%, we switch to text-message check-ins with the front desk.
>
> The biggest risk to the people we serve is a stale listing that sends someone on a long drive, or leaving out people without smartphones. So we flag stale listings, add a 'call before you go' button, offer library computers and a community health worker phone line, and store minimal data, with no medical records.
>
> Sharing staff across organizations is phase two, because credentialing and liability need more groundwork."

## 7:00 – 7:45 · Slide 7: Pilot & Ask

> "The pilot is small: 12 weeks, Athens plus Meigs or Vinton, about ten provider sites, and two library telehealth rooms. The county health department operates it, working with an FQHC, the library system, and Heritage College students as navigators. It needs about a quarter of a staff person, plus a laptop and webcam per room.
>
> We'd know it's working when 80% of listings are confirmed within a week, a quarter of searches turn into bookings, and follow-up visits completed go up.
>
> After the pilot, a public operator keeps it running. For startup we'd apply to Ohio's Rural Health Transformation Program, which we still need to verify, and to grants. After that, provider subscriptions, because a filled slot is revenue.
>
> **Our ask:** an introduction to the Athens County Public Libraries director and one FQHC operations lead, so we can pilot two library telehealth rooms."

## 7:45 – 8:00 · Close (Success slide is optional; skip it if over time)

> "Success at scale means CareBridge becomes the default answer to *'does anyone know a doctor?'* Thank you."

---

# Q&A cheat sheet (5–6 minutes)

Everyone owns a topic. Answer in one or two sentences, then stop.

| Judge asks… | Our answer |
|---|---|
| **Evidence:** *Who did you hear this from?* | A judge who works in rural healthcare described the Facebook-group problem first-hand. County data backs up the shortage: Meigs has 1 primary care physician per 7,350 residents against 1 per 1,328 for Ohio. |
| **Evidence:** *What are you assuming that you haven't checked?* | That providers will keep their "accepting" status current. That's why the pilot's go/no-go measure is the share of listings confirmed within 7 days. |
| **Impact:** *How many people, and what one number shows it's working?* | About 5,150 adults aged 45–64 in three counties went a year without a checkup (an estimate), and about 6,000 households there have no home internet. The one number to watch is follow-up visits completed. |
| **Feasibility:** *Who runs the pilot, and who pays after it?* | A county health department working with an FQHC and the library system. For startup we'd apply to the Ohio Rural Health Transformation Program (eligibility still to verify) and to grants; after that, provider subscriptions or health-system sponsorship, since a filled slot is revenue. |
| **Prototype:** *What happens when something goes wrong? What's real and what's mocked?* | We showed it live: no internet leads to a library telehealth room, and a cancelled van leads to a re-match or telehealth. The app and its logic are built and the locations are real; availability is simulated, and sign-in and the MyChart connection are mocked. |
| **Trust:** *Why would people trust a website more than their neighbors?* | It shows their neighbors: local reviews, "verified by" a local organization they know, and a visible "last confirmed" date. There's also a community health worker people can call. |
| **Who's left out?** *(no smartphone, no broadband, language, disability)* | You can search without an account. It works on any phone browser and on library and church computers in large-text shared-computer mode, and there's a phone-line fallback through a community health worker. Other languages would come after the pilot. |
| **Privacy / HIPAA:** *What data do you hold?* | Search needs no data at all. Booking stores only a ZIP code, insurance type and visit type, never medical records. Provider requirements use de-identified patient codes. |
| **Why not Google, Zocdoc or insurer directories?** | They don't show whether a provider is accepting new patients *this week*, and a federal review has flagged directories listing inactive providers (we're confirming the exact figures). Zocdoc-style tools also skip rural clinics and people without broadband. |
| **AI / errors:** *What if a match or suggestion is wrong?* | Matches and telehealth suggestions are rules-based and shown with the reason. A person accepts every match, and stale listings are flagged instead of hidden. |
