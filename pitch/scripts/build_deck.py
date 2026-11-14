"""Fill the Hackpalachia pitch template with CareBridge content (WS6)."""
import copy, sys
from pptx import Presentation
from pptx.util import Pt

SRC = "/home/vishrut/Software_Projects/HackApalachia26/Athens Hackathon/Hackpalachia_Pitch_Template_Final.pptx"
OUT = sys.argv[1]
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"

prs = Presentation(SRC)


def shape(slide, sid):
    for sh in slide.shapes:
        if sh.shape_id == sid:
            return sh
    raise KeyError(sid)


def set_text(slide, sid, paras, size=None):
    """Replace a text box's paragraphs, reusing the first paragraph/run formatting."""
    if isinstance(paras, str):
        paras = [paras]
    txBody = shape(slide, sid).text_frame._txBody
    ps = txBody.findall(A + "p")
    tmpl = copy.deepcopy(ps[0])
    for r in tmpl.findall(A + "r")[1:]:
        tmpl.remove(r)
    for br in tmpl.findall(A + "br"):
        tmpl.remove(br)
    for p in ps:
        txBody.remove(p)
    for text in paras:
        p = copy.deepcopy(tmpl)
        r = p.find(A + "r")
        r.find(A + "t").text = text
        if size:
            r.find(A + "rPr").set("sz", str(int(size * 100)))
        txBody.append(p)


def notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


# ---------- drop the organizers' "READ FIRST" slide ----------
sldIdLst = prs.slides._sldIdLst
first = list(sldIdLst)[0]
prs.part.drop_rel(first.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"))
sldIdLst.remove(first)

s = list(prs.slides)
title, problem, journey, solution, proto, risks, pilot, success, appendix = s

# ---------- 01 Title ----------
set_text(title, 3, "CareBridge")
set_text(title, 4, "For rural adults around Athens County, Ohio, CareBridge helps them get seen by a "
                   "provider who is actually taking new patients, by replacing word of mouth with "
                   "verified, up-to-date listings and library telehealth.", size=20)
set_text(title, 6, ["[Team name]",
                    "Brielle: [background]  ·  [Name]: [background]  ·  [Name]: [background]"])
set_text(title, 8, "Care Delivery")
notes(title,
      "HOOK (say first): \"Right now, in a Facebook group somewhere in Appalachian Ohio, someone is typing "
      "'does anyone know a doctor who's taking new patients?'\"\n\n"
      "Then read the one-sentence pitch on the slide word for word; judges should be able to repeat it.\n\n"
      "Introduce the team in one breath. Any rural-health background counts as evidence, so mention it.\n\n"
      "Time: ~0:30")

# ---------- 02 Problem ----------
set_text(problem, 6, "Finding a doctor in rural SE Ohio runs on word of mouth, and the answers are often out of date.", size=26)
set_text(problem, 8, "1 : 7,350")
set_text(problem, 9, "Residents per primary care physician in Meigs County, vs. 1 : 1,328 statewide. Vinton: 1 : 6,348.", size=14)
set_text(problem, 10, "County Health Rankings, 2025 · Meigs & Vinton Co. and Ohio", size=10)
set_text(problem, 12, "Adults 45–64 in Athens, Meigs & Vinton can't tell who's taking new patients, so they "
                      "delay care, and many lack home internet for video visits.", size=18)
set_text(problem, 14, ["≈23,100 adults aged 45–64 (ACS 2020–24)",
                       "× 20–24% with no checkup last year (CDC PLACES 2023)",
                       "≈ 5,150 people (estimate)",
                       "+ ≈ 6,000 households with no home internet"], size=12)
set_text(problem, 16, ["“Does anyone know a primary care provider?” “There's one at so-and-so, but they don't take new patients.”",
                       "— Hackathon judge, rural healthcare sector (paraphrased)"], size=13)
set_text(problem, 19, "Show current, trusted availability, and work for people without home internet.")
notes(problem,
      "One barrier, one group, one place: adults 45–64 in Athens, Meigs and Vinton counties who can't tell which "
      "provider is taking new patients.\n\n"
      "Primary care physicians, residents per physician (County Health Rankings 2025): Athens 1:1,591 · Hocking 1:2,341 · "
      "Perry 1:3,546 · Vinton 1:6,348 · Meigs 1:7,350 · Morgan 1:13,682 · Ohio 1:1,328. Meigs has 3 PCPs for ~22,000 people.\n\n"
      "Say the math out loud: Adults 45–64: Athens 13,300 + Meigs 6,137 + Vinton 3,694 = 23,131 (ACS 2020–24, B01001). "
      "No routine checkup in past year: 23.6% / 20.2% / 20.9% (CDC PLACES, BRFSS 2023) → 3,139 + 1,240 + 772 ≈ 5,150. "
      "It's an ESTIMATE: the checkup rate covers all adults, not just 45–64. Households with no internet subscription: "
      "2,978 + 1,977 + 1,050 ≈ 6,000 (ACS 2020–24, B28002). Meigs is 21.7%.\n\n"
      "Quote is paraphrased from a conversation with a hackathon judge from the rural healthcare sector, Nov 2026 — cite the role, never the name.\n\n"
      "Time: ~1:00")

# ---------- 03 Journey ----------
set_text(journey, 6, "Linda's search for a doctor stalls at “they're not taking patients.”")
set_text(journey, 9, "Linda, 52, Glouster")
set_text(journey, 10, "Fictional composite. Medicaid, type 2 diabetes. Her doctor retired; she needs a new one. Spotty home internet.", size=14)
set_text(journey, 12, "Clinic front desk, nearby FQHC, county health dept., Glouster library, her adult daughter, Medicaid plan", size=14)
set_text(journey, 16, "Diabetes refills run out; she needs a new doctor.", size=14)
set_text(journey, 21, "Asks a Facebook group; calls names in her plan's directory.", size=14)
set_text(journey, 26, "2 aren't taking patients; 1 is 50 min away. Video calls drop.", size=14)
set_text(journey, 31, "Care delayed, A1c climbs, she ends up at urgent care or the ER.", size=14)
set_text(journey, 33, "How often SE Ohio listings are actually out of date. Our directory-accuracy evidence is national.")
notes(journey,
      "Label Linda clearly as a fictional composite.\n\n"
      "START: refills run out. TRY: Facebook group + plan directory. BREAKDOWN (orange card): two aren't taking new patients, "
      "the third is 50 minutes away, and video visits drop on her home connection. RESULT: delayed care, rising A1c, urgent care "
      "or ER: the system pays more for worse care.\n\n"
      "Our solution changes step 03.\n\n"
      "Time: ~0:45")

# ---------- 04 Solution ----------
set_text(solution, 6, "See who's really taking patients nearby, and get seen even without home internet.")
set_text(solution, 9, "Stale lists and dead ends: calls to providers who aren't taking patients, and video visits that fail on home internet.")
set_text(solution, 13, "Linda filters “accepting · Medicaid,” sees “Confirmed 2 days ago,” books, and is offered a "
                       "telehealth room at the Glouster library.", size=18)
set_text(solution, 15, "A public operator (county health dept. or state rural-health program). Providers confirm "
                       "listings weekly; libraries host rooms; clinics pool equipment.", size=13)
set_text(solution, 17, "Any phone or a library computer. No app, no cost, no account needed to search.", size=14)
set_text(solution, 19, "Stale listings are flagged. Partner cancels → re-match or telehealth. Unsure? Call a "
                       "community health worker. People make every clinical decision.", size=13)
notes(solution,
      "Patient side: every listing shows when it was last confirmed, who verified it, and neighbors' reviews. Linda books; "
      "because she has no home internet, CareBridge suggests a private telehealth room at the Glouster library with a staff helper.\n\n"
      "Provider side: her new clinic needs a diabetic eye screening. It has the nurse and the exam room but no retinal camera. "
      "CareBridge matches it with a partner that has a portable camera and technician: one trip, a screening day for several patients.\n\n"
      "The tool only suggests options; people make every clinical decision. Stress the trust signals: a neighbor's word, made visible.\n\n"
      "Time: ~1:00")

# ---------- 05 Prototype ----------
set_text(proto, 6, "Linda finds care, even when the internet and the van both fail.")
set_text(proto, 8, ["[Screenshots of each demo beat go here — add before 2:45]",
                    "Live demo: [live URL]"])
set_text(proto, 10, "Linda books a primary care visit; then her clinic arranges an eye screening.", size=14)
set_text(proto, 12, "The “last confirmed” label, and the automatic switch to a library telehealth room.", size=14)
set_text(proto, 14, "No home internet → library room. Van cancelled → re-match. Unsure → call a community health worker.", size=14)
set_text(proto, 15, "Built: app, real-location map, matching, telehealth logic. Simulated: availability, reviews, "
                    "texts. Mocked: sign-in, MyChart link.", size=10)
notes(proto,
      "Spend the most time here (~3:00). Follow the demo script (MASTER_PLAN Section 7) exactly; narrate WHY each step matters, not what you click.\n\n"
      "Beats: (a) search + filters, real Athens-area map, 'Confirmed 2 days ago', stale listing flagged; "
      "(b) connect patient portal (simulated) → Book → flip 'No home internet' → Glouster library telehealth room → text preview; "
      "(c) switch to Provider (Hopewell The Plains) → new requirement: portable retinal camera + technician → match with OhioHealth O'Bleness → accepted; "
      "(d) flip 'Partner cancelled' → re-match to Hocking Valley Community Hospital; (e) optional: /kiosk library-PC view.\n\n"
      "Say it plainly: locations are real; availability, reviews, resources and texts are simulated; sign-in and the MyChart connection are mocked.\n\n"
      "If the live demo breaks: \"Let me show you the same flow from our screenshots\" — never debug live.")

# ---------- 06 Assumptions & risks ----------
set_text(risks, 6, "It only works if listings stay current. Here's how we'd find out.")
set_text(risks, 9, "Providers will confirm “accepting new patients” every week.")
set_text(risks, 13, "Pilot metric: share of listings confirmed within 7 days. ≥80% at week 8 → keep going. "
                    "<50% → switch to front-desk text check-ins.")
set_text(risks, 16, "A stale listing sends someone on a long drive, or people without smartphones get left out.", size=17)
set_text(risks, 20, "Stale flags, “call before you go,” library computers, a community-health-worker phone line, "
                    "minimal data and no medical records.")
notes(risks,
      "Riskiest assumption: providers keep 'accepting new patients' current. Second assumption: they'll share equipment and space "
      "across organizations. Staff sharing is phase 2 because credentialing and liability across organizations need more groundwork.\n\n"
      "Say what we learned today vs. what a pilot still has to test: today we heard the problem from people in rural healthcare; "
      "the pilot tests whether providers actually keep listings fresh.\n\n"
      "Time: ~0:45")

# ---------- 07 Pilot & ask ----------
set_text(pilot, 6, "12 weeks, 3 counties, 2 library telehealth rooms.")
set_text(pilot, 9, "Athens + Meigs/Vinton. ~10 provider sites, 2 library rooms, adults 45–64. 12 weeks.", size=14)
set_text(pilot, 12, "County health dept. (operator), an FQHC, the library system, OU Heritage College navigators. "
                    "Needs: 0.25 FTE lead, laptop + webcam per room.", size=12)
set_text(pilot, 15, "Listings confirmed ≤7 days (≥80%), searches → bookings (≥25%), follow-up visits completed (rising).", size=12)
set_text(pilot, 18, "Public operator long-term. Startup: Ohio Rural Health Transformation Program (to verify) and "
                    "grants; then provider subscriptions.", size=12)
set_text(pilot, 21, "An introduction to the Athens County Public Libraries director and one FQHC operations lead, "
                    "to pilot two library telehealth rooms.", size=20)
notes(pilot,
      "Partners by type: county health department (operator + verifier), an FQHC (listings + a pooled clinic day), the public library "
      "system (rooms + helpers), regional AHEC / OU Heritage College of Osteopathic Medicine (students as navigators), Area Agency on Aging (60+ outreach).\n\n"
      "Measures and 'keep going' results: searches → booking ≥25%; days to first appointment falling; listings confirmed within 7 days ≥80%; "
      "≥40 telehealth visits at access points; follow-up visits completed rising.\n\n"
      "Who pays: ODH Rural Health Transformation Program funding is a possibility we still need to VERIFY (eligibility and timing) — say 'we'd apply to', not 'funded by'.\n\n"
      "End with the ask, word for word.\n\nTime: ~0:45")

# ---------- Success ----------
set_text(success, 5, "AFTER THE PILOT")
set_text(success, 6, ["≥80% of listings confirmed within 7 days", "≥40 telehealth visits at library rooms",
                      "Faster first appointments", "“I trust it more than the Facebook group”"])
set_text(success, 9, ["All 7 SE Ohio counties listed", "Follow-up visits completed rising at listed clinics",
                      "Providers pooling resources without prompting"])
set_text(success, 12, ["Any rural region: the hub, library rooms and weekly confirmations all transfer",
                       "The default answer to “does anyone know a doctor?”"])
notes(success, "Optional (~0:15). If over time, skip this slide and fold one line into the pilot slide.")

# ---------- Appendix ----------
set_text(appendix, 7, [
    "1. County Health Rankings & Roadmaps, 2025 data release · Ohio counties · countyhealthrankings.org",
    "2. U.S. Census Bureau, ACS 2020–24 5-yr, tables B01001 & B28002 · SE Ohio counties · data.census.gov",
    "3. CDC PLACES county estimates (BRFSS 2023) · SE Ohio counties · data.cdc.gov (swc5-untb)",
    "4. Thomas, Dobis & McGranahan, The Nature of the Rural-Urban Mortality Gap, USDA ERS EIB-265, 2024 · U.S.",
    "5. Scripps Gerontology Center, Nursing Homes in Ohio: A Profile, Winter 2025–26 · Ohio",
    "6. Odihi & Malone, Exploratory Analysis of U.S. Health System Workforce Trends, NC RHRP, Jul 2026 · U.S.",
    "7. Maclaren et al., “Come and work here!”, J Health Serv Res Policy 30(3), 2025 · rural UK",
    "8. HHS-OIG, OEI-02-23-00540 (provider directory accuracy), Oct 2025 · U.S. · figures to verify",
    "9. Ohio Dept. of Health, Rural Health Transformation Program · Ohio · odh.ohio.gov · eligibility to verify",
    "10. Provider & library locations: Hopewell Health, ACPL, OhioHealth, Memorial Health, OpenStreetMap (2026)",
], size=9)
set_text(appendix, 9, "Estimate: ≈5,150 applies an all-adult checkup rate to ages 45–64. USDA, OIG and the UK study are "
                      "not SE Ohio-specific; verify locally. Demo availability, reviews and resources are simulated. "
                      "Heard from: hackathon judges (rural healthcare, pharma), by role.", size=10)
set_text(appendix, 11, ["Brielle: [background or role], [contact]",
                        "[Name]: [background or role], [contact]",
                        "[Name]: [background or role], [contact]",
                        "[Name]: [background or role], [contact]"], size=14)
for sid in (8, 9):
    shape(appendix, sid).top += 420000
notes(appendix, "Not presented; shared with judges while they score Evidence. Full evidence bank with figures: docs/evidence.md.")

prs.save(OUT)
print("saved", OUT)
