// Case definitions for the configurator.
//
// The configurator renders entirely from this data: adding /case-2 means
// adding an object here plus its assets, with no markup or script changes.
// Imported from .astro frontmatter only — never from a client script, since
// the image imports resolve to build-time ImageMetadata objects.

import heroCase from "../assets/configurator/hero-case.png";
import caseWithWines from "../assets/configurator/case-with-wines.png";
import detailSlats from "../assets/configurator/product-img2.png";
import detailEdge from "../assets/configurator/intro-img.png";
import detailWood from "../assets/configurator/collection1.jpg";

export const case001 = {
  id: "case-001",
  name: "Case 001",

  // Fixed per case — no option changes it.
  price: "19 500 \u20ac",

  // Stage renders, stacked and crossfaded. Each carries its own width
  // because the two shots are framed differently (990x746 vs 764x504), so
  // a shared box would either crop one or shrink the other.
  //
  // The first entry is the opening render. A step can name another one to
  // take over from that point on; the overview keeps whatever the last step
  // was showing.
  renders: [
    { id: "empty", src: heroCase, alt: "Case 001, open", width: "35.5rem" },
    {
      id: "wines",
      src: caseWithWines,
      alt: "Case 001 with its wine selection",
      width: "49.5rem",
    },
  ],

  // Right-hand rail. The first entry is the main view: it has no `detail`
  // image, so selecting it returns the stage to the configured render.
  // Every other entry takes over the whole stage background instead — these
  // are full photographs, not renders on a transparent ground, so they can't
  // simply replace the floating case.
  thumbs: [
    { id: "case", label: "Case view", thumb: heroCase },
    {
      id: "slats",
      label: "Compartments detail",
      thumb: detailSlats,
      detail: detailSlats,
    },
    { id: "edge", label: "Edge detail", thumb: detailEdge, detail: detailEdge },
    {
      id: "wood",
      label: "Interior wood detail",
      thumb: detailWood,
      detail: detailWood,
    },
  ],

  // One screen per step, in order. The CTA is always named after the screen
  // it leads to, and the last step's CTA leads to the overview.
  steps: [
    {
      id: "material",
      label: "Choose Your Material",
      cta: "Finish",
      options: [
        { id: "stainless", label: "Stainless" },
        { id: "brass", label: "Brass" },
      ],
    },
    {
      id: "finish",
      label: "Choose Your Finish",
      cta: "Wine",
      options: [
        { id: "mirror", label: "Mirror" },
        { id: "satin", label: "Satin" },
        { id: "black", label: "Black" },
      ],
    },
    {
      id: "wine",
      label: "Choose Your Wine Selection",
      cta: "Overview",
      render: "wines",
      options: [
        { id: "domaine", label: "Domaine" },
        { id: "chateau", label: "Ch\u00e2teau" },
      ],
    },
  ],

  // Reference sheet for the case. Nothing here is read by the configurator —
  // it is the product data the client supplied, kept alongside the case so a
  // future spec section, quote or PDF has a single source for it, and so
  // every new case has a template to fill in.
  //
  // Empty strings are slots the client has not filled yet, left in place on
  // purpose so the shape of what is still missing stays visible.
  details: {
    specifications: {
      dimensions: { length: "91 cm", width: "38 cm", height: "21 cm" },
      weight: { withoutBottles: "35 Kg", withBottles: "44 Kg" },
      bottleCapacity: 8,
    },

    materials: {
      exteriorMetal: ["Stainless steel", "Brass"],
      interior:
        "Plywood construction with genuine wood veneer facing, clear finish, satin",
      // The supplied sheet lists two finishes; the configurator's finish step
      // offers three (Mirror / Satin / Black).
      finishes: [
        {
          name: "Mirror polish",
          description: "steel polished to a mirror-like effect",
        },
        { name: "Satin", description: "hand-brushed surface finish" },
      ],
    },

    craftsmanship: [
      {
        title: "Made in France",
        copy: "Crafted in local artisan workshops in France.",
      },
      {
        title: "Hand Assembly",
        copy: "Entirely assembled and finished by hand.",
      },
      {
        title: "Precision Manufacturing",
        copy: "A single, continuous hand guiding the piece through every stage of its creation.",
      },
      {
        title: "Quality Control",
        copy: "This unbroken workmanship ensures optimal quality control, from creation through to final packing for shipment your guarantee of consistent excellence.",
      },
    ],

    wine: {
      // Keyed by the wine step's option ids, so a selection maps straight to
      // its description.
      selections: {
        domaine: {
          intro:
            "Domaine selections are drawn exclusively from the finest Burgundy estates",
          examplesLabel: "Example Domaines that suit this selection include:",
          // One slot per bottle the case holds.
          examples: ["", "", "", "", "", "", "", ""],
        },
        chateau: {
          intro:
            "Ch\u00e2teau selections from the finest Grand Cru Class\u00e9 ch\u00e2teaux of Bordeaux",
          examplesLabel: "Example Ch\u00e2teau that suit this selection include:",
          examples: ["", "", "", "", "", "", "", ""],
        },
      },
      bottleFormats: "75cl bottles",
      vintageSelection:
        "The choice of ch\u00e2teaux, vintages, and wines is guided by the client's personal taste and preferences, ensuring each case reflects the selection best suited to them.",
      bespokeConfiguration:
        "Any request for a specific domaine is accommodated through a custom configuration, with the case priced accordingly to reflect that selection.",
    },
  },
};

export const cases = {
  [case001.id]: case001,
};

// Copy behind the (i) beside the price. Identical for every case, so it sits
// outside the case objects. Paragraphs are rendered with set:html for the
// hard line breaks.
export const infoSections = [
  {
    title: "Pricing policy",
    paragraphs: [
      "Suggested retail price. Taxes, delivery and insurance are calculated according to the destination and confirmed in the personalised quotation. Suggested retail prices are provided for guidance and may be updated without prior notice.",
      "Oenofy products may not be advertised or offered above the suggested retail price. Tie-in sales or any practice likely to compromise the positioning of the collection are not permitted.",
      "Distribution of Oenofy collections is entrusted to carefully selected partners and Oenofy.<br />Each distributor remains independently responsible for its relationship with its clients.",
    ],
  },
  {
    title: "Model availability",
    paragraphs: [
      "Every Oenofy collection is individually handcrafted and assembled to order by skilled artisans. Each piece undergoes meticulous quality control before leaving our workshop, ensuring the highest standards of craftsmanship and presentation.",
      "As every collection is produced specifically for its owner, a minimum production lead time of six weeks should be expected. Certain bespoke finishes or special requests may require additional time. Availability may vary depending on materials, components and production capacity.",
    ],
  },
  {
    title: "Wine Selection",
    paragraphs: [
      "Every Oenofy collection is individually curated according to the client&rsquo;s project and preferences.<br />The bottles shown in photographs and visual representations are provided for illustrative purposes only and do not necessarily reflect the final selection.",
      "A personalised wine proposal is prepared following the quotation process. While individual references may vary depending on availability and the client&rsquo;s objectives, the final selection will always reflect an equivalent level of quality, rarity, reputation and overall value.",
    ],
  },
];

// Confirmation screen shown after the request form is sent. Not case
// specific, so it sits outside the case objects like infoSections.
export const successMessage = {
  headlines: [
    "Your selection is now in our hands.",
    "We will review your request carefully and contact you shortly.",
  ],
  copy: "Our team will carefully examine your configuration, verify the availability of the selected finishes and wines,<br />and prepare a personalised quotation tailored to your project. We will then contact you to discuss the next steps.",
  note: "A request does not constitute an order. Your Collection will only be confirmed after written acceptance of the final quotation.",
  close: "Close",
};
