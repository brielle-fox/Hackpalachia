# CareBridge — Evidence

Hackpalachia Rural Health Hackathon · Athens, OH · Nov 14, 2026 · Track: Care Delivery

This is the backing for slides 2, 3, 6 and 7 and the appendix slide. Every fact has a source, year and place. ✅ = checked against the source. ⚠️ = a person must verify it before it goes on a slide or is said out loud.

## Evidence bank (cite source · year · place)

✅ = checked against the source · ⚠️ = needs a human to verify before it goes on a slide

### From the organizer-provided reports (all ✅, checked against the PDFs)
| # | Fact | Source · year · place |
|---|---|---|
| E1 | In 2019, the natural-cause death rate for rural adults aged 25–54 was **43% higher** than for urban adults of the same age. In 1999 the gap was 6%. For all ages the gap grew from 6% to 20%. | Thomas, Dobis & McGranahan, *The Nature of the Rural-Urban Mortality Gap*, USDA ERS EIB-265, Mar 2024 · U.S. (CDC WONDER 1999–2019) |
| E2 | Ohio nursing homes report **severe or very severe access problems** for Medicaid residents with **transportation (40%)** and **emergency dental care (30%)**. | Scripps Gerontology Center, *Nursing Homes in Ohio: A Profile*, Winter 2025–26 · Ohio |
| E3 | Ohio nursing-staff turnover is **57.9%** (RNs 52.9%), above the national average and above every neighboring state. | Same as E2 (CMS 2023 data) · Ohio |
| E4 | From 2018 to 2023, nurse practitioners per health-system bed rose **0.18 → 0.30 (+66.7%)** and physician assistants **0.09 → 0.15 (+66.7%)**, while physicians rose only +4.5%. Health systems are relying more on NPs and PAs. | Odihi & Malone, *An Exploratory Analysis of U.S. Health System Workforce Trends*, NC Rural Health Research Program, Jul 2026 · U.S. (AHRQ Compendium) |
| E5 | Rural communities recruit and keep health staff through **informal networks of trusted local people**. The study recommends a formal community stakeholder group to reduce reliance on individual goodwill. This supports building on community trust. | Maclaren et al., *"Come and work here!"*, J Health Serv Res Policy 30(3), 2025 · remote/rural UK (⚠️ outside Ohio) |
| E6 | Ohio's **Rural Health Transformation Program** is a possible funding route. | ODH, odh.ohio.gov/know-our-programs/rural-health-transformation-program (listed in the organizers' data-source doc) · Ohio. ⚠️ Verify eligibility and timing |

### Local numbers (researched today)
| # | Fact | Source · year · place | Status |
|---|---|---|---|
| L1 | Primary care physician ratio, residents per physician: Athens **1,591:1** (39 PCPs), Hocking 2,341:1, Perry 3,546:1, Vinton **6,348:1** (2 PCPs), Meigs **7,350:1** (3 PCPs), Morgan 13,682:1 (1 PCP), Washington 1,382:1. Ohio 1,328:1; U.S. 1,334:1 | County Health Rankings & Roadmaps, 2025 release, analytic data file (countyhealthrankings.org → Data & Documentation → `analytic_data2025.csv`) · SE Ohio counties. The underlying physician data year is per CHR documentation, likely 2021 | ✅ (ratios computed from CHR's numerator and denominator) |
| L2 | Adults aged 45–64: Athens 13,300 (21.5% of 61,737), Meigs 6,137 (28.0%), Vinton 3,694 (29.2%), Hocking 7,860, Perry 9,574, Morgan 3,714, Washington 15,839. **All 7 counties: 60,118** | U.S. Census ACS 2020–2024 5-year, table B01001 (via api.censusreporter.org; confirm on data.census.gov) · SE Ohio | ✅ |
| L3 | Households with **no internet subscription** (no access, or access without a subscription): Athens 2,978 (12.9%), Meigs 1,977 (**21.7%**), Vinton 1,050 (19.7%), Morgan 17.9%, Hocking 13.7%, Perry 13.3%, Washington 12.2%. **All 7 counties: 13,431 households (14.4%)** | U.S. Census ACS 2020–2024 5-year, table B28002 · SE Ohio | ✅ |
| L4 | Adults with a routine checkup in the past year: Athens **76.4%**, Meigs 79.8%, Vinton 79.1%, Hocking 80.1%, Perry 79.2%, Morgan 80.8%, Washington 80.9% | CDC PLACES county estimates (BRFSS 2023 model-based), data.cdc.gov dataset swc5-untb · SE Ohio | ✅ |
| L5 | Uninsured adults aged 18–64: Athens 7.8%, Meigs 9.6%, Vinton 9.5% | CDC PLACES (BRFSS 2023) · SE Ohio | ✅ |
| L6 | Federal investigators found plan directories listing many **inactive** behavioral-health providers: reported as **55%** in Medicare Advantage plans and **28%** in Medicaid managed care plans | HHS-OIG, OEI-02-23-00540, Oct 2025 · U.S. Percentages are from the AHA news summary (aha.org/news/headline/2025-10-20-…); confirm in the full OIG PDF | ⚠️ |
| L7 | HRSA primary care Health Professional Shortage Area status for Athens, Meigs and Vinton | TODO: check data.hrsa.gov/topics/health-workforce/shortage-areas (search by county), or the Ohio Primary Care Office | ⚠️ TODO |

### "How many people" math (slide 2)
```
Pilot counties: Athens + Meigs + Vinton
Adults 45–64 (ACS 2020–24):      13,300 + 6,137 + 3,694 = 23,131
× no checkup in past year (PLACES 2023, all adults):
   13,300 × 23.6% = 3,139
    6,137 × 20.2% = 1,240
    3,694 × 20.9% =   772
                     ─────
                   ≈ 5,150 adults aged 45–64 without a routine checkup last year   (ESTIMATE)
Households with no internet subscription: 2,978 + 1,977 + 1,050 ≈ 6,000           (ACS 2020–24)
At scale (all 7 counties): 60,118 adults aged 45–64; 13,431 households offline.
```

## People we heard from (by role, never by name)

| Who | What we heard | Where it's used |
|---|---|---|
| Hackathon judge, rural healthcare sector | Adults aged about 45–60 ask rural Facebook groups "does anyone know a primary care provider?" and get answers like "there's one at so-and-so, but they don't take new patients." | Slide 2 "What we heard" (paraphrased) |
| Hackathon judges from healthcare, pharma and other sectors | Liked that the idea scales to any rural population, not just SE Ohio | Success slide ("at scale"); Q&A |
| _Add any subject-matter experts you talk to today (role only)_ | | |

## ⚠️ Verify before presenting

1. **HHS-OIG directory findings (L6):** the 55% (Medicare Advantage) and 28% (Medicaid managed care) inactive-provider figures come from an AHA news summary. Confirm them in the full OIG report (OEI-02-23-00540) before saying them. The deck appendix lists this source as "figures to verify" and the slides don't quote the numbers.
2. **HRSA shortage-area status (L7)** for Athens, Meigs and Vinton: not looked up. Check data.hrsa.gov → Shortage Areas, by county. The deck doesn't claim it.
3. **Ohio Rural Health Transformation Program (E6):** eligibility and timing aren't confirmed. The pilot slide says "(to verify)"; in speech say "we'd apply to", not "funded by".
4. **The ≈5,150 estimate** applies an all-adult checkup rate to ages 45–64. Always call it an estimate.
5. **Non-local sources:** the USDA mortality figures and the OIG findings are national, and the Maclaren et al. study is from the UK. Say so if asked.
6. **Demo data:** provider and library locations are real (Appendix A of MASTER_PLAN.md). Availability, reviews, "verified by" badges and shared resources are simulated.
