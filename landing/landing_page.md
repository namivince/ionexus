---
title: "Landing Page"
slug: "/"
page_type: "landing"
brand: "iONexus"
version: "0.1.0"
updated: "2025-09-16"
---

# Landing Page — iONexus

## Mục tiêu
Trang chủ công khai, tập trung vào tìm kiếm BĐS (giống Property Finder).

## Navigation
- Logo iONexus
- Tabs: Buy | Rent | Commercial | New Projects | Find Agent | Explore | Mortgages
- CTA: Login/Register

## Hero / Search
- Tabset: Buy/Rent/Commercial/Projects
- Input: City/Community/Building
- CTA: Find
- Filter chips: Property Type, Beds & Baths, Price, More
- Toggle: Map View

## Sections
- Popular Searches
- Featured Projects (carousel)
- Explore by Area (tiles)
- Featured Properties (grid)
- Featured Agencies
- Articles & Guides
- CTA: Download app / Create alert / Subscribe newsletter
- Footer links

## Wireframe
[Header nav]
[Hero Search]
[Popular Searches]
[Featured Projects Carousel]
[Explore by Area Tiles]
[Featured Properties Grid]
[Featured Agencies Grid]
[Articles & Guides]
[CTA Section]
[Footer]

pgsql
Sao chép mã

## Sample JSON
```json
{
  "mode": "buy",
  "query": "Dubai Marina",
  "filters": {
    "property_type": ["Apartment"],
    "beds": 2,
    "price_max": 2000000
  },
  "popular": ["1BR Marina", "Villas Palm Jumeirah"],
  "featured_projects": [{"id":"p1","title":"Canal Crown Tower"}]
}
yaml
Sao chép mã

---

## `buy/buy_overview.md`
```markdown
---
title: "Buy Overview"
slug: "/buy"
page_type: "overview"
brand: "iONexus"
---

# Buy Overview

## Mục tiêu
Trang landing con cho user quan tâm **mua**.

## Layout
- Hero search (Buy tab active)
- Section: Featured Projects for Sale
- Section: Explore by Area
- Articles: "How to buy in Dubai", "Mortgage tips"

## Navigation
- Link sang `/buy/listing`
