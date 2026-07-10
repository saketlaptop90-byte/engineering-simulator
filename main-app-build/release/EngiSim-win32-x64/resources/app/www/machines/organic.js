import { darkSteel, whitePlastic, redAccent, blueAccent, ghostMaterial, tinted, orangeAccent, yellowAccent, greenAccent, purpleAccent, steel } from '../utils/materials.js';
import * as THREE from 'three';

export function createOrganicReactions(THREE_arg, requestedId) {
  const group = new THREE.Group();
  const parts = [];

  const cMat = darkSteel.clone();
  const hMat = whitePlastic.clone();
  const oMat = redAccent.clone();
  const nMat = blueAccent.clone();
  const clMat = greenAccent.clone();
  const brMat = orangeAccent.clone();
  const bondMat = ghostMaterial.clone();
  bondMat.opacity = 0.6;
  const electronMat = tinted.clone();

  function createAtom(mat, rad, pos, role) {
      const a = new THREE.Mesh(new THREE.SphereGeometry(rad, 16, 16), mat);
      a.position.copy(pos);
      a.userData.role = role;
      a.userData.basePos = pos.clone();
      return a;
  }

  function createBond(pos, rot, scale, role) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 8), bondMat);
      b.position.copy(pos);
      if(rot) b.rotation.set(rot.x, rot.y, rot.z);
      b.scale.set(1, scale, 1);
      b.userData.role = role;
      b.userData.baseScale = scale;
      return b;
  }

  const reactionList = [
    { name: "Addition reactions", desc: "A double bond breaks and two new atoms attach (e.g. Halogenation of alkene).", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-0.5, 0, 0), 'substrate'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0.5, 0, 0), 'substrate'));
        g.add(createBond(new THREE.Vector3(0, 0.15, 0), {x:0,y:0,z:Math.PI/2}, 1, 'piBond'));
        g.add(createAtom(clMat, 0.3, new THREE.Vector3(0, 2, 0), 'nucleophile'));
    }},
    { name: "Elimination reactions", desc: "Atoms are removed from adjacent carbons, forming a double bond.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-0.5, 0, 0), 'substrate'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0.5, 0, 0), 'substrate'));
        g.add(createAtom(hMat, 0.25, new THREE.Vector3(-0.5, -1, 0), 'leavingGroupH'));
        g.add(createAtom(brMat, 0.35, new THREE.Vector3(0.5, 1, 0), 'leavingGroupX'));
        g.add(createAtom(oMat, 0.35, new THREE.Vector3(-2, -1, 0), 'base'));
    }},
    { name: "Substitution reactions", desc: "One functional group is replaced by another (SN1/SN2).", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'substrate'));
        g.add(createAtom(clMat, 0.35, new THREE.Vector3(1, 0, 0), 'leavingGroup'));
        g.add(createAtom(oMat, 0.35, new THREE.Vector3(-2, 0, 0), 'nucleophile'));
    }},
    { name: "Rearrangement reactions", desc: "Carbon skeleton undergoes structural reorganization.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'substrate'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'substrate'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'substrate'));
        g.add(createAtom(hMat, 0.3, new THREE.Vector3(-1, 1, 0), 'migrateGroup'));
    }},
    { name: "Oxidation reactions", desc: "Increase in bonds to Oxygen or loss of Hydrogen.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'substrate'));
        g.add(createAtom(oMat, 0.35, new THREE.Vector3(0, 1, 0), 'substrate'));
        g.add(createAtom(oMat, 0.35, new THREE.Vector3(2, 0, 0), 'oxidant'));
    }},
    { name: "Reduction reactions", desc: "Increase in bonds to Hydrogen or loss of Oxygen.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-0.5, 0, 0), 'substrate'));
        g.add(createAtom(oMat, 0.4, new THREE.Vector3(0.5, 0, 0), 'substrate'));
        g.add(createAtom(hMat, 0.25, new THREE.Vector3(-2, 0, 0), 'reductant'));
    }},
    { name: "Condensation reactions", desc: "Two molecules combine with the loss of a small molecule (often water).", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'substrate1'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(-0.3, 0, 0), 'waterLeaving'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'substrate2'));
        g.add(createAtom(hMat, 0.2, new THREE.Vector3(0.3, 0, 0), 'waterLeaving'));
    }},
    { name: "Cyclization reactions", desc: "A linear chain folds and bonds to form a ring structure.", setup: (g) => {
        for(let i=0; i<6; i++) {
            g.add(createAtom(cMat, 0.3, new THREE.Vector3(i*0.6 - 1.5, 0, 0), 'foldingChain'));
        }
    }},
    { name: "Polymerization reactions", desc: "Monomers link together to form a long polymer chain.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-2, 0, 0), 'monomer'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'monomer'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(2, 0, 0), 'monomer'));
        g.add(createBond(new THREE.Vector3(-1, 0, 0), {x:0,y:0,z:Math.PI/2}, 1, 'polymerBond'));
        g.add(createBond(new THREE.Vector3(1, 0, 0), {x:0,y:0,z:Math.PI/2}, 1, 'polymerBond'));
    }},
    { name: "Pericyclic reactions", desc: "Concerted reactions proceeding through a cyclic transition state.", setup: (g) => {
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(-0.5, 0.5, 0), 'peri'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(0.5, 0.5, 0), 'peri'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(0, -0.5, 0), 'peri'));
        g.add(createBond(new THREE.Vector3(0,0,0), null, 1.5, 'tsRing'));
    }},
    { name: "Aldol Reaction", desc: "Enolate reacts with a carbonyl to form a Î²-hydroxy carbonyl.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'enolate'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'carbonyl'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(1, 0.8, 0), 'oxygen'));
    }},
    { name: "Cannizzaro Reaction", desc: "Base-induced disproportionation of aldehydes lacking alpha-hydrogens.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'aldehyde1'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'aldehyde2'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(0, 1, 0), 'baseAttack'));
    }},
    { name: "Dielsâ€“Alder Reaction", desc: "[4+2] cycloaddition of a diene and a dienophile.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0.5, 0), 'diene'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, -0.5, 0), 'diene'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'dienophile'));
        g.add(createBond(new THREE.Vector3(0,0,0), {x:0,y:0,z:0}, 1, 'cycloBond'));
    }},
    { name: "Friedelâ€“Crafts Alkylation", desc: "Electrophilic aromatic substitution to attach an alkyl group to a benzene ring.", setup: (g) => {
        g.add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 6), cMat)); // Benzene ring approx
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(2, 0, 0), 'alkylGroup'));
        g.add(createAtom(blueAccent, 0.2, new THREE.Vector3(1, 1, 0), 'lewisAcid'));
    }},
    { name: "Friedelâ€“Crafts Acylation", desc: "Attaches an acyl group to an aromatic ring to form a ketone.", setup: (g) => {
        g.add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 6), cMat));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(2, 0, 0), 'acylGroup'));
        g.add(createAtom(oMat, 0.25, new THREE.Vector3(2.5, 0.5, 0), 'acylOxygen'));
    }},
    { name: "Grignard Reaction", desc: "Addition of an organomagnesium halide to a carbonyl.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'carbonyl'));
        g.add(createAtom(steel, 0.35, new THREE.Vector3(-2, 0, 0), 'grignardMg'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(-1, 0, 0), 'grignardR'));
    }},
    { name: "Wittig Reaction", desc: "Aldehyde or ketone reacts with a phosphonium ylide to form an alkene.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'carbonyl'));
        g.add(createAtom(orangeAccent, 0.4, new THREE.Vector3(-1, 0, 0), 'ylideP'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(-0.2, 0, 0), 'ylideC'));
        g.add(createBond(new THREE.Vector3(0.5,0,0), {x:0,y:0,z:Math.PI/2}, 0.5, 'oxaphosphetane'));
    }},
    { name: "Suzuki Coupling", desc: "Palladium-catalyzed coupling of a boronic acid with a halide.", setup: (g) => {
        g.add(createAtom(steel, 0.4, new THREE.Vector3(0, 1, 0), 'pdCatalyst'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1.5, 0, 0), 'arylBoronic'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1.5, 0, 0), 'arylHalide'));
    }},
    { name: "Heck Reaction", desc: "Palladium-catalyzed cross-coupling of an alkene with a halide.", setup: (g) => {
        g.add(createAtom(steel, 0.4, new THREE.Vector3(0, 1, 0), 'pdCatalyst'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'alkene'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'arylHalide'));
    }},
    { name: "Sonogashira Coupling", desc: "Pd/Cu-catalyzed coupling of a terminal alkyne with a halide.", setup: (g) => {
        g.add(createAtom(steel, 0.3, new THREE.Vector3(-0.5, 1, 0), 'pdCatalyst'));
        g.add(createAtom(orangeAccent, 0.25, new THREE.Vector3(0.5, 1, 0), 'cuCatalyst'));
        g.add(createAtom(cMat, 0.35, new THREE.Vector3(-1, 0, 0), 'alkyne'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'halide'));
    }},
    { name: "Claisen Rearrangement", desc: "Heat-induced [3,3]-sigmatropic rearrangement of an allyl vinyl ether.", setup: (g) => {
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(-1, -0.5, 0), 'peri'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(-0.5, 0.5, 0), 'peri'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(0.5, 0.5, 0), 'peri'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(1, -0.5, 0), 'peri'));
    }},
    { name: "Michael Addition", desc: "Nucleophilic conjugate addition to an Î±,Î²-unsaturated carbonyl.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'unsaturatedSystem'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(0, 0, 0), 'betaCarbon'));
        g.add(createAtom(cMat, 0.35, new THREE.Vector3(-2, 0, 0), 'michaelDonor'));
    }},
    { name: "Mannich Reaction", desc: "Amino alkylation of an acidic proton next to a carbonyl.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1.5, 0, 0), 'enolizable'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(0, 0, 0), 'formaldehyde'));
        g.add(createAtom(nMat, 0.35, new THREE.Vector3(1.5, 0, 0), 'amine'));
    }},
    { name: "Sandmeyer Reaction", desc: "Conversion of diazonium salts to aryl halides using Cu(I) salts.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'arylGroup'));
        g.add(createAtom(nMat, 0.3, new THREE.Vector3(0, 1, 0), 'diazonium'));
        g.add(createAtom(clMat, 0.3, new THREE.Vector3(2, 0, 0), 'cuHalide'));
    }},
    { name: "Kolbe Electrolysis", desc: "Electrochemical oxidative decarboxylation of carboxylic acids.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'carboxylate1'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'carboxylate2'));
        g.add(createAtom(electronMat, 0.2, new THREE.Vector3(0, 1, 0), 'electronLoss'));
    }},
    { name: "Clemmensen Reduction", desc: "Reduction of ketones/aldehydes to alkanes using Zn/Hg and HCl.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'carbonyl'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(0, 1, 0), 'oxygenLeaving'));
        g.add(createAtom(steel, 0.3, new THREE.Vector3(-1.5, 0, 0), 'znAmalgam'));
    }},
    { name: "Wolffâ€“Kishner Reduction", desc: "Reduction of carbonyls to alkanes via hydrazone intermediate.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'carbonyl'));
        g.add(createAtom(nMat, 0.3, new THREE.Vector3(1, 0, 0), 'hydrazine'));
        g.add(createAtom(nMat, 0.3, new THREE.Vector3(1.5, 0, 0), 'hydrazine2'));
        g.add(createAtom(oMat, 0.25, new THREE.Vector3(0, 1, 0), 'waterLeaving'));
    }},
    { name: "Baeyerâ€“Villiger Oxidation", desc: "Oxidation of a ketone to an ester using peroxyacids.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'ketone'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(1.5, 0, 0), 'peroxyOxygen'));
        g.add(createAtom(cMat, 0.3, new THREE.Vector3(1, 0, 0), 'migrateGroup'));
    }},
    { name: "Birch Reduction", desc: "Reduction of aromatic rings to non-conjugated dienes using alkali metals in liquid ammonia.", setup: (g) => {
        g.add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 8, 6), cMat)); // Benzene
        g.add(createAtom(blueAccent, 0.4, new THREE.Vector3(1.5, 0, 0), 'solvatedElectron'));
    }},
    { name: "Perkin Reaction", desc: "Condensation of aromatic aldehydes with acid anhydrides.", setup: (g) => {
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'aromaticAldehyde'));
        g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'anhydrideEnolate'));
        g.add(createAtom(oMat, 0.3, new THREE.Vector3(0, 1, 0), 'waterLeaving'));
    }}
  ];

  const advancedReactionsList = [
    "Appel Reaction", "Arndtâ€“Eistert Reaction", "Bamfordâ€“Stevens Reaction", "Barton Reaction", "Bartonâ€“McCombie Deoxygenation",
    "Beckmann Rearrangement", "Benzoin Condensation", "Bischlerâ€“Napieralski Reaction", "Bouveaultâ€“Blanc Reduction", "Buchwaldâ€“Hartwig Amination",
    "Coreyâ€“Fuchs Reaction", "Coreyâ€“House Reaction", "Coreyâ€“Chaykovsky Reaction", "Curtius Rearrangement", "Darzens Reaction",
    "Dessâ€“Martin Oxidation", "Dieckmann Condensation", "Doebner Reaction", "Eschweilerâ€“Clarke Reaction", "Favorskii Rearrangement",
    "Finkelstein Reaction", "Fischer Esterification", "Fischer Indole Synthesis", "Forster Reaction", "Gabriel Synthesis",
    "Gattermann Reaction", "Gattermannâ€“Koch Reaction", "Gombergâ€“Bachmann Reaction", "Hantzsch Pyridine Synthesis", "Hellâ€“Volhardâ€“Zelinsky Reaction",
    "Hofmann Rearrangement", "Hofmann Elimination", "Hornerâ€“Wadsworthâ€“Emmons Reaction", "Hunsdiecker Reaction", "Jones Oxidation",
    "Knoevenagel Condensation", "Leuckart Reaction", "Lindlar Reduction", "Meerweinâ€“Ponndorfâ€“Verley Reduction", "Mitsunobu Reaction",
    "Mukaiyama Aldol Reaction", "Nef Reaction", "Nozakiâ€“Hiyamaâ€“Kishi Reaction", "Oppenauer Oxidation", "Paalâ€“Knorr Synthesis",
    "Peterson Olefination", "Pictetâ€“Spengler Reaction", "Pinacol Rearrangement", "Prins Reaction", "Rosenmund Reduction",
    "Sakurai Reaction", "Schmidt Reaction", "Sharpless Epoxidation", "Skraup Synthesis", "Staudinger Reaction",
    "Stephen Aldehyde Synthesis", "Stille Coupling", "Swern Oxidation", "Tiffeneauâ€“Demjanov Rearrangement", "Ullmann Reaction",
    "Vilsmeierâ€“Haack Reaction", "Wacker Oxidation", "Williamson Ether Synthesis", "Wohlâ€“Ziegler Reaction", "Wurtz Reaction",
    "Wurtzâ€“Fittig Reaction", "Zieglerâ€“Natta Polymerization", "Reformatsky Reaction", "Pinner Reaction", "Ritter Reaction",
    "Tishchenko Reaction", "Balzâ€“Schiemann Reaction", "Chichibabin Reaction", "Combes Quinoline Synthesis", "Conradâ€“Limpach Synthesis",
    "Pomeranzâ€“Fritsch Reaction", "Biginelli Reaction", "Pechmann Condensation", "Robinson Annulation", "Thorpe Reaction",
    "Thorpeâ€“Ziegler Reaction", "Ugi Reaction", "Passerini Reaction", "Suzukiâ€“Miyaura Coupling", "Negishi Coupling",
    "Kumada Coupling", "Hiyama Coupling", "Bucherer Reaction", "Buchererâ€“Bergs Reaction", "Rupe Rearrangement",
    "Wohl Degradation", "Zinin Reduction", "Aza-Wittig Reaction", "Baylisâ€“Hillman Reaction", "Evans Aldol Reaction",
    "Julia Olefination", "Juliaâ€“Kocienski Olefination", "Moffatt Oxidation", "Rambergâ€“BÃ¤cklund Reaction", "Tebbe Olefination",
    "Yamaguchi Esterification", "Yamada Coupling", "Acyloin Condensation",
    "Auwers Reaction", "Baeyer Condensation", "Bakerâ€“Venkataraman Rearrangement", "Bamfordâ€“Stevens Reaction", "Barbier Reaction",
    "Bergman Cyclization", "Bischlerâ€“MÃ¶hlau Indole Synthesis", "Blaise Reaction", "Bohlmannâ€“Rahtz Pyridine Synthesis", "Borodin Reaction",
    "Brook Rearrangement", "Buchner Ring Expansion", "Cadiotâ€“Chodkiewicz Coupling", "Cannizzaroâ€“Tishchenko Reaction", "Castroâ€“Stephens Coupling",
    "Chapman Rearrangement", "Chugaev Elimination", "Claisen Condensation", "Cope Rearrangement", "Cope Elimination", "Criegee Rearrangement",
    "Dakin Oxidation", "Demjanov Rearrangement", "Dowdâ€“Beckwith Ring Expansion", "Elbs Persulfate Oxidation", "Emde Degradation",
    "Eschenmoser Fragmentation", "Ferrier Rearrangement", "Fritschâ€“Buttenbergâ€“Wiechell Rearrangement", "FriedlÃ¤nder Quinoline Synthesis", "Fries Rearrangement",
    "Fukuyama Coupling", "Fukuyama Reduction", "Glycol Cleavage", "Grewe Cyclization", "Hiyama Coupling", "Hiyamaâ€“Denmark Coupling",
    "Hunsdieckerâ€“Borodin Reaction", "Irelandâ€“Claisen Rearrangement", "Kharasch Addition", "Kharaschâ€“Sosnovsky Reaction", "Koenigsâ€“Knorr Reaction",
    "Kolbeâ€“Schmitt Reaction", "KrÃ¶hnke Pyridine Synthesis", "Lobry de Bruynâ€“Alberda van Ekenstein Transformation", "Losen Rearrangement",
    "Malaprade Reaction", "McMurry Reaction", "Meyerâ€“Schuster Rearrangement", "Michaelisâ€“Arbuzov Reaction", "Minisci Reaction",
    "Mislowâ€“Evans Rearrangement", "Nenitzescu Indole Synthesis", "Nicholas Reaction", "Overman Rearrangement", "PaternÃ²â€“BÃ¼chi Reaction",
    "Payne Rearrangement", "Pfitzinger Reaction", "Pschorr Reaction", "Pummerer Rearrangement", "Rieche Formylation",
    "Robinsonâ€“Gabriel Synthesis", "Seyferthâ€“Gilbert Homologation", "Shi Epoxidation", "Sommelet Reaction", "Sommeletâ€“Hauser Rearrangement",
    "Stobbe Condensation", "Tsujiâ€“Trost Reaction", "Ullmann Condensation", "Van Leusen Reaction", "Wallach Rearrangement",
    "Willgerodt Reaction", "Willgerodtâ€“Kindler Reaction", "Wohlâ€“Aue Reaction", "Woodward Cis-Hydroxylation", "Zincke Reaction",
    "Zinckeâ€“Suhl Reaction", "Alder Ene Reaction", "Alderâ€“Rickert Reaction", "Achmatowicz Rearrangement", "Akabori Reaction",
    "Bredereck Reaction", "Brown Hydroboration", "Burgess Dehydration", "Ciamicianâ€“Dennstedt Rearrangement", "Coreyâ€“Kim Oxidation",
    "Daubenâ€“Michno Rearrangement", "Ene Reaction", "Eschweilerâ€“Clarke Methylation", "Fujimotoâ€“Belleau Reaction", "Grob Fragmentation",
    "Hammick Reaction", "Henry Reaction", "Huisgen Cycloaddition", "Krapcho Decarboxylation", "Luche Reduction",
    "Mannichâ€“Doebner Reaction", "Mukaiyama Michael Addition", "Nenajdenko Reaction", "Norrish Type I Reaction", "Norrish Type II Reaction",
    "Paalâ€“Knorr Pyrrole Synthesis", "PrÃ©vost Reaction", "Simmonsâ€“Smith Reaction",
    "Abramov Reaction", "Acyloin Ester Condensation", "Alderâ€“Stein Reaction", "Allanâ€“Robinson Reaction", "Algarâ€“Flynnâ€“Oyamada Reaction",
    "Angeliâ€“Rimini Reaction", "AnschÃ¼tz Reaction", "Asinger Reaction", "Atkinson Reaction", "BÃ¤cklund Transformation",
    "Baeyerâ€“Drewson Indigo Synthesis", "Bamberger Rearrangement", "Barger Reaction", "Bartoli Indole Synthesis", "Belousovâ€“Zhabotinsky Reaction",
    "Benedict Reaction", "Bergius Process", "Biginelli Dihydropyrimidine Synthesis", "Bischlerâ€“MÃ¶hlau Reaction", "Bohlmann Reaction",
    "Borscheâ€“Drechsel Cyclization", "Bouveault Aldehyde Synthesis", "Bredt Reaction", "Breslow Intermediate Reaction", "Bucherer Carbazole Synthesis",
    "Cadogan Cyclization", "Castagnoliâ€“Cushman Reaction", "Chakrabarti Reaction", "Chichibabin Pyridine Synthesis", "Claisenâ€“Schmidt Condensation",
    "Comins Reaction", "Coniaâ€“Ene Reaction", "Cornforth Rearrangement", "Craig Method", "Currier Reaction", "Dakinâ€“West Reaction",
    "Danheiser Annulation", "DelÃ©pine Reaction", "Doeringâ€“LaFlamme Olefination", "Duff Reaction", "Edman Degradation",
    "Einhornâ€“Brunner Reaction", "Enamine Alkylation", "Erlenmeyerâ€“PlÃ¶chl Azlactone Synthesis", "Eschweiler Reaction", "Fenton Reaction",
    "Ferrier Carbocyclization", "Fischerâ€“Speier Esterification", "Frankland Reaction", "Fuchs Reaction", "Furukawa Modification",
    "Gilman Reaction", "Guareschiâ€“Thorpe Condensation", "Guerbet Reaction", "Hantzsch Dihydropyridine Synthesis", "Haworth Methylation",
    "Haworth Phenanthrene Synthesis", "Heckâ€“Mizoroki Reaction", "Hinsberg Reaction", "Hoesch Reaction", "Jacobsen Epoxidation",
    "Jappâ€“Klingemann Reaction", "Kagan Reaction", "Kizhner Reduction", "Knoorr Pyrrole Synthesis", "Kornblum Oxidation",
    "Ledererâ€“Manasse Reaction", "Leimgruberâ€“Batcho Indole Synthesis", "Lemieuxâ€“Johnson Oxidation", "Madelung Synthesis", "Maillard Reaction",
    "Malonic Ester Synthesis", "Mannichâ€“Mannich Reaction", "Marckwald Reaction", "Meerwein Arylation", "Meyer Reaction",
    "Miyaura Borylation", "Mukaiyama Hydration", "Nencki Reaction", "Niementowski Quinoline Synthesis", "Noyori Hydrogenation",
    "Olefin Metathesis", "Oxo Process", "Parham Cyclization", "Pausonâ€“Khand Reaction", "Perkow Reaction", "Polonovski Reaction",
    "Povarov Reaction", "Prevostâ€“Woodward Reaction", "Pudovik Reaction", "Radziszewski Imidazole Synthesis", "Reissert Reaction",
    "Ritterâ€“Frank Reaction", "Rosenmundâ€“von Braun Reaction", "Rubottom Oxidation", "Schiemann Reaction", "Scholl Reaction",
    "SkattebÃ¸l Rearrangement", "Stetter Reaction", "Stork Enamine Reaction", "Strecker Amino Acid Synthesis", "Takai Olefination",
    "Tollens Reaction", "Ullmannâ€“Goldberg Reaction", "Vilsmeier Reaction", "Wenker Synthesis", "Wessely Oxidation",
    "Adams Catalytic Hydrogenation", "Arensâ€“van Dorp Reaction", "Arndt Synthesis", "Baeyer Strain Theory Reaction", "Balabanâ€“Nenitzescuâ€“Praill Synthesis",
    "Barton Nitrite Photolysis", "Barton Vinyl Iodide Synthesis", "BÃ©champ Reduction", "Benary Reaction", "Bergiusâ€“Pier Hydrogenation",
    "Bingel Reaction", "Bohlmannâ€“Rahtz Synthesis", "Borsche Indole Synthesis", "Bouveault Reaction", "Bredereck Synthesis",
    "Brook Rearrangement", "Brown Allylation", "Ciamician Photochemical Reaction", "Claisenâ€“Ireland Rearrangement", "Conradâ€“Limpach Quinoline Synthesis",
    "Corey Lactone Synthesis", "Coreyâ€“Winter Olefin Synthesis", "Cram Chelation Reaction", "Danheiser Benzannulation", "Darzens Glycidic Ester Condensation",
    "Delepine Amine Synthesis", "Dessâ€“Martin Oxidation", "Diazo Transfer Reaction", "DÃ¶tz Benzannulation", "Elbs Reaction",
    "Enamine Reaction", "Eschmoserâ€“Claisen Rearrangement", "Evansâ€“Tishchenko Reaction", "Feistâ€“Benary Synthesis", "Finkelstein Halide Exchange",
    "Forsterâ€“Decker Reaction", "Friedelâ€“Crafts Arylation", "Fukuyama Indole Synthesis", "Garner Aldehyde Synthesis", "Gilch Polymerization",
    "Gomberg Reaction", "Grob Cyclization", "Gryskiewiczâ€“Trochimowski Reaction", "Hallerâ€“Bauer Reaction", "Hammond Rearrangement",
    "Hantzsch Thiazole Synthesis", "Haworth Reaction", "Hiyama Cross Coupling", "Horner Reaction", "Jacobsen Hydrolytic Kinetic Resolution",
    "Juliaâ€“Lythgoe Olefination", "Knoevenagelâ€“Doebner Condensation", "Kornblumâ€“DeLaMare Rearrangement", "Larock Indole Synthesis", "Liebeskindâ€“Srogl Coupling",
    "Lobry de Bruyn Transformation", "Maillard Browning Reaction", "Marckwald Rearrangement", "Meyerâ€“Schuster Rearrangement", "Michaelisâ€“Becker Reaction",
    "Moffattâ€“Swern Oxidation", "Montgomery Coupling", "Mukaiyama Reagent Reduction", "Nazarov Cyclization", "Nefis Reaction",
    "Nozaki Coupling", "Parikhâ€“Doering Oxidation", "Petasis Reaction", "Pictetâ€“Gams Reaction", "Piancatelli Rearrangement",
    "Polonovskiâ€“Potier Reaction", "Prilezhaev Epoxidation", "Rabeâ€“Kindler Rearrangement", "Radziszewski Reaction", "Reformatskyâ€“Claisen Rearrangement",
    "Ritter Amidation", "Roush Allylation", "Sakurai Allylation", "Schlosser Modification", "Schottenâ€“Baumann Reaction",
    "Sugasawa Reaction", "Tamao Oxidation", "Tebbe Methylenation", "Tiemann Rearrangement", "Trost Allylic Alkylation",
    "Umpolung Reaction", "Vedejs Olefination", "Wackerâ€“Tsuji Oxidation", "Wadsworthâ€“Emmons Reaction", "Weerman Degradation",
    "Wharton Reaction", "Wolff Rearrangement", "Yamadaâ€“Curtius Rearrangement", "Yamamoto Coupling", "Yokoyama Reaction",
    "ZemplÃ©n Deacylation", "Zimmermanâ€“Traxler Reaction",
    "Abelman Rearrangement", "Abe Reaction", "Auwersâ€“Skita Rearrangement", "Aza-Cope Rearrangement", "Baldwin Cyclization",
    "Bamford Rearrangement", "Banert Cascade Reaction", "Barluenga Coupling", "Barton Ester Reaction", "BÃ©champ Reaction",
    "BelluÅ¡â€“Claisen Rearrangement", "Bergmanâ€“Masamune Cyclization", "Bingelâ€“Hirsch Reaction", "Birkofer Reduction", "Bohlmann Cyclization",
    "Bredereck Cyclization", "Bruckner Reaction", "Buchnerâ€“Curtiusâ€“Schlotterbeck Reaction", "Bunte Salt Reaction", "Carroll Rearrangement",
    "Castro Reaction", "Chanâ€“Lam Coupling", "Cheletropic Reaction", "Conia Cyclization", "Cornforth Rearrangement",
    "Craig Cyclization", "Criegee Oxidation", "Dauben Oxidation", "De Mayo Reaction", "DeMayo Cycloaddition",
    "Dielsâ€“Alder Cycloaddition", "DÃ¶tz Reaction", "Effenberger Cyclization", "Einhorn Reaction", "Eschenmoser Methenylation",
    "Eschenmoser Sulfide Contraction", "FÃ©tizon Oxidation", "Fischerâ€“Hepp Rearrangement", "FriedlÃ¤nder Annulation", "Fritsch Pyridine Synthesis",
    "Furukawa Reaction", "Geissmanâ€“Waiss Lactone Synthesis", "Gassman Indole Synthesis", "Gilman Coupling", "Goldberg Reaction",
    "Grieco Elimination", "Hauser Annulation", "Heckâ€“Matsuda Reaction", "Hiyamaâ€“Hatanaka Coupling", "Hofmannâ€“Martius Rearrangement",
    "Hunsdiecker Decarboxylation", "Ireland Rearrangement", "Johnsonâ€“Claisen Rearrangement", "Kende Cyclization", "Kishi Reduction",
    "Knoorr Quinoline Synthesis", "Kucherov Reaction", "Kumadaâ€“Corriu Coupling", "Luche Hydride Reduction", "MacDonald Condensation",
    "Mannich Cyclization", "Masamune Alkylation", "Mislow Rearrangement", "Mitsunobu Inversion", "Mukaiyama Mannich Reaction",
    "Narasaka Reduction", "Narasakaâ€“Heck Reaction", "Neber Rearrangement", "Nenitzescu Reaction", "Noyori Transfer Hydrogenation",
    "Ohiraâ€“Bestmann Reaction", "Overberger Rearrangement", "Parham Reaction", "Pauson Cyclization", "Pechmann Reaction",
    "Peterson Reaction", "Pfitznerâ€“Moffatt Oxidation", "Piancatelli Cyclization", "Prins Cyclization", "Rauhutâ€“Currier Reaction",
    "Reformatsky Condensation", "Robinsonâ€“SchÃ¶pf Reaction", "Rosenmund Hydrogenation", "Sakurai Reaction", "Schmidt Rearrangement",
    "Scholl Cyclodehydrogenation", "Seyferthâ€“Gilbert Reaction", "Shapiro Reaction", "Shiina Esterification", "Stillâ€“Gennari Olefination",
    "Storkâ€“Danheiser Reaction", "Tebbe Reaction", "Tsuji Carbonylation", "Ugiâ€“Smiles Reaction", "Wacker Process",
    "Wohlâ€“Ziegler Bromination", "Yamaguchi Macrolactonization", "Yamamotoâ€“Itoh Rearrangement", "Zard Reaction", "Zerewitinoff Reaction",
    "Aza-Wacker Reaction", "Aza-Dielsâ€“Alder Reaction", "Aza-Prins Cyclization", "Aza-Michael Addition", "Aza-Baylisâ€“Hillman Reaction",
    "Aza-Payne Rearrangement", "Aza-Brook Rearrangement", "Aza-Copeâ€“Mannich Reaction", "Balzâ€“Schiemann Fluorination", "Bartonâ€“Zard Pyrrole Synthesis",
    "Belokon Amino Acid Synthesis", "Bischler Indole Synthesis", "Boger Pyridine Synthesis", "Boultonâ€“Katritzky Rearrangement", "Buchererâ€“Lieb Reaction",
    "Cacchi Reaction", "Catellani Reaction", "Charette Cyclopropanation", "Chugaev Reaction", "Claisenâ€“Schmidt Reaction",
    "Coreyâ€“Bakshiâ€“Shibata Reduction", "Coreyâ€“Seebach Reaction", "Coreyâ€“Nicolaou Macrolactonization", "Cornforthâ€“Firth Rearrangement", "Danishefsky Diene Reaction",
    "De Kimpe Rearrangement", "Doebnerâ€“Miller Reaction", "Einhornâ€“Brunner Cyclization", "Eschweiler Methylation", "Evans Auxiliary Alkylation",
    "Evansâ€“Saksena Reduction", "Favorskii Ethynylation", "Feist Synthesis", "FÃ©tizon Dehydrogenation", "Franckâ€“Condon Reaction",
    "Friedelâ€“Crafts Formylation", "Fujimoto Reaction", "Fukuyama Alkylation", "Gattermann Formylation", "Gewald Reaction",
    "Glyoxalase Reaction", "Grubbs Olefin Metathesis", "Hajosâ€“Parrish Reaction", "Hantzsch Ester Synthesis", "Haworth Synthesis",
    "Heckâ€“Mizoroki Coupling", "Hiyamaâ€“Utimoto Reaction", "Hosomiâ€“Sakurai Reaction", "Jacobsenâ€“Katsuki Epoxidation", "JÃ¸rgensen Asymmetric Reaction",
    "Juliaâ€“Colonna Epoxidation", "Kabalka Reaction", "Kaganâ€“Modena Reaction", "Kishiâ€“Nozaki Reaction", "Knochelâ€“Hauser Reaction",
    "Kocienski Modification", "Kumadaâ€“Tamao Coupling", "Leuckartâ€“Wallach Reaction", "Liebeskind Coupling", "Lombardo Methylenation",
    "Luche Reaction", "Mannichâ€“Robinson Annulation", "Maruoka Alkylation", "Masamuneâ€“Roush Olefination", "Meldrum Acid Synthesis",
    "Moffatt Reaction", "Montgomery Reaction", "Mukaiyama Glycosylation", "Nakamura Coupling", "Narasaka Cyclization",
    "Nicholas Cyclization", "Noyori Asymmetric Hydrogenation", "Otera Esterification", "Paalâ€“Knorr Furan Synthesis", "Paalâ€“Knorr Thiophene Synthesis",
    "Petasis Boronoâ€“Mannich Reaction", "Pictetâ€“Hubert Reaction", "Pummerer Cyclization", "Rautenstrauch Rearrangement", "Rhodium-Catalyzed Hydroformylation",
    "Rieche Reaction", "Saegusa Oxidation", "Sakuraiâ€“Hosomi Allylation", "Schlosser Olefination", "Shiina Macrolactonization",
    "Stilleâ€“Kelly Coupling", "Stork Alkylation", "Takaiâ€“Utimoto Olefination", "Tishchenko Reduction", "Tsujiâ€“Wacker Oxidation",
    "Uenoâ€“Stork Radical Cyclization", "Wackerâ€“Smidt Reaction", "Weinreb Ketone Synthesis", "Yamaguchi Reaction", "Yb-Catalyzed Aldol Reaction",
    "Ytterbium-Mediated Reduction", "Zincke Nitration",
    "Achmatowicz Oxidation", "Acker Reaction", "Acyloin Rearrangement", "Adkins Reduction", "Akabori Amino Acid Reaction",
    "Albrightâ€“Goldman Oxidation", "Amadori Rearrangement", "Arbuzov Reaction", "Baeyerâ€“Emmerling Indigo Synthesis", "Bamberger Cleavage",
    "Barton Decarboxylation", "Bartonâ€“Kellogg Olefination", "BÃ©champ Reduction", "BeloÑƒÑÐ¾Ð²â€“Zhabotinsky Oscillating Reaction", "Bergius Hydrogenation",
    "Birch Alkylation", "Bohlmann Reduction", "Borscheâ€“Drechsel Reaction", "Bredereck Reagent Reaction", "Buchwald Amidation",
    "Bunte Reaction", "Cava Reaction", "Ciamician Rearrangement", "Conradâ€“Limpach Cyclization", "Coreyâ€“Link Reaction",
    "Cornblum Oxidation", "Daubenâ€“Taylor Reaction", "DCC Esterification", "Dakinâ€“West Acylation", "Danheiser Annulation Reaction",
    "DelÃ©pine Amination", "Duff Formylation", "Edman Sequencing Reaction", "Emmons Olefination", "Favorskii Rearrangement Reaction",
    "Feistâ€“Benary Condensation", "FÃ©tizon Oxidation", "Fischer Oxazole Synthesis", "Fischerâ€“Speier Reaction", "Franzen Rearrangement",
    "FriedlÃ¤nder Synthesis", "Fritschâ€“Buttenbergâ€“Wiechell Rearrangement", "Fukuyama Reduction Method", "Geissman Reaction", "Glaser Coupling",
    "Glaserâ€“Hay Coupling", "Goldberg Amination", "Gombergâ€“Bachmann Arylation", "Graham Oxidation", "Grieco Dehydration",
    "Hauserâ€“Kraus Annulation", "Hell Reaction", "Henry Nitroaldol Reaction", "Heron Rearrangement", "Herz Reaction",
    "Hinsberg Sulfonamide Synthesis", "Hiyamaâ€“Utimoto Cyclization", "Hoesch Acylation", "Horner Olefination", "Hunsdiecker Bromodecarboxylation",
    "Imamoto Reaction", "Jacobsen Hydrolysis", "Jappâ€“Klingemann Condensation", "Kharasch Peroxide Effect", "Kingâ€“Knorr Synthesis",
    "Knoevenagel Reaction", "Kornblum Degradation", "Lemieux Oxidation", "Leuckart Amination", "Lobry de Bruyn Rearrangement",
    "Madelung Indole Synthesis", "Mannich Aminomethylation", "Mitsunobu Esterification", "Mukaiyama Aldol Condensation", "Nef Oxidation",
    "Nenitzescu Indole Reaction", "Nozakiâ€“Hiyama Coupling", "Pausonâ€“Khand Cyclization", "Perkow Reaction", "Pfitzinger Quinoline Synthesis",
    "Pinner Imino Ether Synthesis", "Polonovski Oxidation", "Prevost Dihydroxylation", "Ritter Amidation", "Rosenmund Reduction Reaction",
    "Rubottom Oxidation", "Saegusaâ€“Ito Oxidation", "Schiemann Fluorination", "Scholl Oxidative Coupling", "Shono Oxidation",
    "Stetter Umpolung Reaction", "Stillâ€“Wittig Rearrangement", "Strecker Synthesis", "Takai Reaction", "Tamaoâ€“Fleming Oxidation",
    "Tiemann Formylation", "Tsuji Allylation", "Wallach Rearrangement", "Weinreb Amide Synthesis", "Wenker Aziridine Synthesis",
    "Wharton Olefin Synthesis", "Ziegler Alkylation", "Zincke Aldehyde Synthesis",
    "Auwers Synthesis", "BÃ¤ckstrÃ¶m Reaction", "Bamberger Rearrangement", "Barton Amination", "Bergmann Degradation",
    "Blaise Ketone Synthesis", "Bredt Olefin Synthesis", "Brown Crotylation", "Caglioti Reduction", "Ciamicianâ€“Silber Rearrangement",
    "Claisen Glycine Synthesis", "Coniaâ€“Ene Cyclization", "Coreyâ€“Posnerâ€“Whitesidesâ€“House Reaction", "Cram Rearrangement", "CrabbÃ© Homologation",
    "Dauben Cyclopropanation", "Delepine Synthesis", "Denmark Cycloaddition", "Djerassiâ€“Rylander Oxidation", "Doebner Condensation",
    "Effenberger Synthesis", "Enders Hydrazone Alkylation", "Evans Alkylation", "Felkinâ€“Anh Reaction", "FÃ©tizon Reagent Oxidation",
    "Fieser Reduction", "Fischerâ€“Tropsch Process", "Forster Rearrangement", "Franzen Rearrangement", "Friedman Reaction",
    "Fritsch Indole Synthesis", "Fujisawa Coupling", "Ganem Oxidation", "Grewe Rearrangement", "Grob Fragmentation Reaction",
    "Hajosâ€“Wiechert Reaction", "Hallerâ€“Bauer Cleavage", "Hanessianâ€“Julia Reaction", "Haworth Reduction", "Henbest Reaction",
    "Hornerâ€“Wittig Reaction", "Houkâ€“List Aldol Reaction", "Irelandâ€“Cope Rearrangement", "Johnsonâ€“Coreyâ€“Chaykovsky Reaction", "Jones Oxidation Method",
    "Kende Rearrangement", "Kharasch Cyclization", "Kishi Aldol Reaction", "Knoevenagelâ€“Michael Reaction", "KÃ¼rti Rearrangement",
    "Luche Conjugate Reduction", "MacMillan Organocatalytic Reaction", "Masamuneâ€“Claisen Rearrangement", "Meerwein Rearrangement", "Meyerâ€“Nitro Reaction",
    "Mislow Rearrangement Reaction", "Moffatt Oxidation Method", "Montgomery Reductive Coupling", "Mukaiyama Glycosidation", "Mukaiyamaâ€“Michael Reaction",
    "Nazarov Cyclization Reaction", "Nenajdenko Fluorination", "Noyori Reduction", "Padwa Rearrangement", "Parikhâ€“Doering Oxidation Method",
    "Paterson Aldol Reaction", "Pauson Carbonylative Cyclization", "Petasis Olefination", "Pfitzner Oxidation", "Prinsâ€“Pinacol Rearrangement",
    "Rauhut Condensation", "Rieche Formylation Method", "Roush Crotylation", "Saegusa Reaction", "Schmidt Degradation",
    "Schotten Acylation", "Seebach Umpolung Reaction", "SeOâ‚‚ Oxidation", "Shapiro Olefination", "Shono Oxidative Methoxylation",
    "Still Rearrangement", "Stille Carbonylation", "Storkâ€“Eschenmoser Alkylation", "Suzukiâ€“Miyaura Cross Coupling", "Tebbe Methylenation Reaction",
    "Tiffeneau Ring Expansion", "Tomioka Reaction", "Trost Desymmetrization", "Ullmann Biaryl Coupling", "Vedejs Olefination Reaction",
    "Weinrebâ€“Nahm Ketone Synthesis", "Woodward Dihydroxylation", "Yamaguchi Esterification Method", "Yamamoto Aldol Reaction", "Ziegler Cyclization",
    "Zimmerman Rearrangement",
    "Abe Homologation", "Abikoâ€“Masamune Aldol Reaction", "Abramovâ€“Pudovik Reaction", "Alper Hydrocarbonylation", "Ando Olefination",
    "Atkinson Olefination", "Aza-Darzens Reaction", "Aza-Wittig Cyclization", "Baldwin Ring Closure", "Barbierâ€“Wieland Degradation",
    "Barton Imidazole Synthesis", "Beller Cyclization", "Benkeser Reduction", "Bergbreiter Reaction", "Binger Reaction",
    "Bohlmannâ€“Rahtz Annulation", "Bourgeois Lactonization", "Bradsher Cycloaddition", "Brunner Reaction", "Cadiot Reaction",
    "Campbell Aldehyde Synthesis", "Carroll Reaction", "Castagnoli Reaction", "Cava Pyrolysis", "Chichibabin Amination",
    "Chugaev Pyrolysis", "Cossy Allylation", "Craig Rearrangement", "Cramâ€“Felkin Addition", "Daubenâ€“Michno Oxidation",
    "Davis Oxaziridine Oxidation", "Delepine Amination", "Demjanov Ring Expansion", "DÃ¶tz Annulation", "Evansâ€“Mislow Rearrangement",
    "FÃ©tizonâ€“Jury Oxidation", "Fieserâ€“Work Reduction", "Finkelstein Exchange", "Forsterâ€“Decker Rearrangement", "Franck Cyclization",
    "Friedelâ€“Crafts Hydroxyalkylation", "Fukuyama Coupling Reaction", "Ganem Lactam Synthesis", "Gilman Ketone Synthesis", "Gompper Reaction",
    "Grobâ€“Eschenmoser Fragmentation", "Hammick Decarboxylation", "Hassâ€“Bender Oxidation", "Haworth Rearrangement", "Heck Arylation",
    "Hunsdieckerâ€“Simonini Reaction", "Ireland Rearrangement Reaction", "Jacobsen Kinetic Resolution", "Jappâ€“Maitland Reaction", "Juliaâ€“Lythgoe Olefination",
    "Kharasch Addition Reaction", "Kita Oxidation", "Knoevenagelâ€“Doebner Synthesis", "Krapcho Dealkoxycarbonylation", "Larock Annulation",
    "Lemieuxâ€“von Rudloff Oxidation", "Levinson Reaction", "Liebeskindâ€“Srogl Cross Coupling", "Lindgren Oxidation", "Mannichâ€“Type Reaction",
    "Masamune Coupling", "Meyers Alkylation", "Mukaiyama Hydration Reaction", "Nagata Reaction", "Narasaka Cyclization Reaction",
    "Nef Rearrangement", "Noyori Transfer Reduction", "Ochiai Rearrangement", "Ohiraâ€“Bestmann Alkynylation", "Otera Transesterification",
    "Padwa Cycloaddition", "Paternoâ€“BÃ¼chi Cyclization", "Petasis Methylenation", "Pummerer Rearrangement Reaction", "Radziszewski Synthesis",
    "Rauhutâ€“Currier Coupling", "Ritter Lactam Synthesis", "Robinsonâ€“Mannich Annulation", "Saegusaâ€“Ito Dehydrogenation", "Schlosser Base Modification",
    "Seebach Alkylation", "Shono Electrooxidation", "Stetter Coupling", "Stork Enamine Alkylation", "Takai Vinylation",
    "Tebbe Olefination", "Tsujiâ€“Trost Allylation", "Van Leusen Imidazole Synthesis", "Wacker Oxidation Process", "Wolff Cyclocondensation",
    "Yamaguchi Macrolactonization", "Yamamoto Coupling Reaction", "Zard Pyrrole Synthesis", "Zimmermanâ€“O'Connell Reaction",
    "Ahlbrecht Reaction", "Akiyamaâ€“Mannich Reaction", "Albrightâ€“Goldman Oxidation", "Almeria Reaction", "Arens Reaction",
    "Aza-Benzoin Reaction", "Aza-Henry Reaction", "BÃ¤ckvall Oxidation", "Bakerâ€“Nathan Effect", "Bamford Reaction",
    "Barluengaâ€“ValdÃ©s Coupling", "Barton Sulfoxide Elimination", "Baylis Reaction", "Beckwith Rearrangement", "Bergbreiter Hydrosilylation",
    "Bergman Cycloaromatization", "Biginelli Condensation", "Bischler Cyclization", "Blanc Chloromethylation", "Boger Cycloaddition",
    "Borch Reduction", "Bredereck Formylation", "Breslow Catalysis", "Bucherer Hydantoin Synthesis", "Cacchi Cyclization",
    "Carreira Alkynylation", "Catellani Annulation", "Charette Asymmetric Cyclopropanation", "Claisenâ€“Eschenmoser Rearrangement", "Cossy Reaction",
    "Cram Chelation-Controlled Addition", "Crich Glycosylation", "Danheiser Benzannulation", "Davis Î±-Hydroxylation", "De Kimpe Expansion",
    "Denmark Allylation", "Deslongchamps Annulation", "Dielsâ€“Alder Dimerization", "Enders Asymmetric Alkylation", "Evans Syn Aldol Reaction",
    "Feringa Alkylation", "Fleming Oxidation", "Fukuyama Amination", "Ganem Cyclization", "Gassman Oxindole Synthesis",
    "Geissmanâ€“Waiss Rearrangement", "Giese Radical Addition", "Greene Cyclization", "Griecoâ€“Sharpless Olefination", "Hartwig Amination",
    "Hay Coupling", "Heck Carbonylation", "Hornerâ€“Wadsworthâ€“Emmons Olefination", "Hosomi Reaction", "Imamoto Alkylation",
    "Irelandâ€“Claisen Reaction", "Itsuno Reduction", "Jacobsen Hydrolytic Resolution", "Juliaâ€“Kocienski Olefination", "Kagan Esterification",
    "Kaganâ€“Modena Oxidation", "Kishi Epoxidation", "Kocienski Sulfone Olefination", "Kumada Cross Coupling", "Ley Oxidation",
    "Lombardo Olefination", "MacMillan Dielsâ€“Alder Reaction", "Marshall Reaction", "Masamuneâ€“Evans Auxiliary Reaction", "Miyaura Coupling",
    "Moffattâ€“Pfitzner Oxidation", "Morken Hydroboration", "Mukaiyama Glycosylation Reaction", "Myers Alkylation", "Nagata Hydrocyanation",
    "Narasakaâ€“Prasad Reduction", "Negishi Cross Coupling", "Nicolaou Macrolactonization", "Nozaki Allylation", "Padwa Rearrangement",
    "Parham Cyclization Reaction", "Paterson Anti Aldol Reaction", "Pearlman Hydrogenation", "Pfaltz Cyclization", "Pinnick Oxidation",
    "PrÃ©vostâ€“Woodward Hydroxylation", "Roush Asymmetric Allylation", "Rubottom Rearrangement", "Rychnovsky Acetal Reaction", "Sakuraiâ€“Hosomi Reaction",
    "Schreiber Cyclization", "Sharpless Dihydroxylation", "Shiina Esterification Reaction", "Stillâ€“Genari Olefination", "Tamaoâ€“Kumada Oxidation",
    "Toste Cycloisomerization", "Uenoâ€“Stork Cyclization", "Woodwardâ€“PrÃ©vost Reaction", "Yamamotoâ€“Ono Cyclization", "Yonemitsu Reaction",
    "Zaitsev Elimination",
    "AbbÃ© Reaction", "Abelman Cyclization", "Akiyama Aldol Reaction", "Allylic Claisen Rearrangement", "Anelli Oxidation",
    "Arakiâ€“Liebeskind Reaction", "Aza-Friedelâ€“Crafts Reaction", "Aza-Moritaâ€“Baylisâ€“Hillman Reaction", "BÃ¤ckvall Rearrangement", "Bamfordâ€“Stevens Olefination",
    "Barton Transposition", "Beller Carbonylation", "Benkeser Hydrogenation", "Bergman Rearrangement", "Black Rearrangement",
    "Blechert Olefin Metathesis", "Blickeâ€“Mills Reaction", "Boger Annulation", "Borch Reductive Amination", "Bredereck Cyclocondensation",
    "Burgess Dehydration Reaction", "Cadiotâ€“Chodkiewicz Coupling Reaction", "Cairncross Reduction", "Capleâ€“Myers Cyclization", "Carreira Allylation",
    "Chichibabin Heterocyclization", "Claisenâ€“Johnson Rearrangement", "Comins Cyclization", "Corey Lactonization", "Coreyâ€“Fuchs Homologation",
    "Coreyâ€“Itsuno Reduction", "Criegee Glycol Cleavage", "Danishefsky Cycloaddition", "Davis Amination", "Delepine Reaction Method",
    "Deslongchamps Transannular Cyclization", "Dreiding Cyclization", "Enders Hydrazone Reaction", "Eschenmoser Coupling", "Evans Auxiliary Aldol Reaction",
    "Feringa Conjugate Addition", "Finkelstein Halogen Exchange", "Flemingâ€“Tamao Oxidation", "Fraterâ€“Seebach Alkylation", "Friedelâ€“Crafts Hydroxyalkylation Reaction",
    "Fujita Cyclization", "Giese Addition", "Gomberg Dimerization", "Grubbs Ring-Closing Metathesis", "Hanessian Rearrangement",
    "Hartwigâ€“Buchwald Amination", "Heckâ€“Matsuda Arylation", "Huisgen Dipolar Cycloaddition", "Imamoto Rearrangement", "Jacobsen Epoxidation Reaction",
    "Jappâ€“Klingemann Synthesis", "Kagan Reduction", "Katsuki Epoxidation", "Knochel Coupling", "Kocienskiâ€“Julia Olefination",
    "Leyâ€“Griffith Oxidation", "Lipshutz Coupling", "MacMillan Alkylation", "Masamuneâ€“Bergman Cyclization", "Meyers Annulation",
    "Mitsunobu Inversion Reaction", "Morken Diboration", "Myers Reductive Alkylation", "Nicolaou Glycosylation", "Noyori Asymmetric Reduction",
    "Padwa Cascade Cyclization", "Palladium-Catalyzed Carbonylation", "Pfaltz Hydrogenation", "Pinnick Chlorite Oxidation", "Rautenstrauch Cycloisomerization",
    "Roush Crotylboration", "Rychnovsky Rearrangement", "Schrock Metathesis", "Seebachâ€“Frater Reaction", "Shibasaki Aldol Reaction",
    "Shono Methoxylation", "Still Rearrangement Reaction", "Toste Gold Cyclization", "Utimoto Cyclization", "Vedejs Esterification",
    "Weinrebâ€“Nahm Reaction", "Wender Cyclization", "Woodward Hydroxylation", "Yamamoto Rearrangement", "Yoon Cycloaddition",
    "Zweifel Olefination",
    "AbbÃ© Condensation", "Acheson Indole Synthesis", "Adamkiewicz Reaction", "Akabori Reduction", "Alder Ene Cyclization",
    "Algarâ€“Flynnâ€“Oyamada Oxidation", "Anelliâ€“Montanari Oxidation", "Arndtâ€“Eistert Homologation", "Asinger Multicomponent Reaction", "Atkinson Fragmentation",
    "Aza-Cope Rearrangement Reaction", "Baldwin Cyclization Rules", "Bang Reaction", "Barton Olefination", "BÃ©champ Reduction Method",
    "Beller Amination", "Bergiusâ€“Bergmann Reduction", "Bingel Cyclopropanation", "Blanc Reaction", "Bohlmannâ€“Rahtz Pyridine Formation",
    "Boultonâ€“Katritzky Rearrangement Reaction", "Bouveault Reduction", "Bradsher Cyclization", "Bucherer Transformation", "Cadiot Alkynyl Coupling",
    "Campbell Cyclization", "Carroll Rearrangement Reaction", "Castroâ€“Stephens Alkynylation", "Chichibabin Pyridine Reaction", "Cope Rearrangement Reaction",
    "Coreyâ€“Kim Oxidation Method", "Coreyâ€“Seebach Umpolung", "Craig Method Rearrangement", "Criegee Oxidative Cleavage", "Curtius Degradation",
    "Dauben Oxidation Reaction", "DCC Coupling", "De Mayo Photocycloaddition", "Dessâ€“Martin Periodinane Oxidation", "Djerassi Oxidation",
    "Doebnerâ€“Miller Quinoline Synthesis", "Duff Ortho Formylation", "Edman Protein Degradation", "Eschweilerâ€“Clarke Reductive Methylation", "Favorskii Ring Contraction",
    "Feistâ€“Benary Furan Synthesis", "Fischerâ€“Hepp Rearrangement Reaction", "Frankland Reaction", "Friedelâ€“Crafts Acylation Reaction", "Fukuyama Thioester Reduction",
    "Ganem Amination", "Gattermannâ€“Adams Reaction", "Geissmanâ€“Waiss Rearrangement Reaction", "Gilman Reagent Coupling", "Glaser Oxidative Coupling",
    "Goldberg Coupling", "Grieco Elimination Reaction", "Hauser Annulation Reaction", "Heck Cross Coupling", "Hellâ€“Volhardâ€“Zelinsky Halogenation",
    "Hinsberg Test Reaction", "Hoesch Condensation", "Hornerâ€“Emmons Reaction", "Hunsdiecker Decarboxylative Halogenation", "Jacobsenâ€“Katsuki Asymmetric Epoxidation",
    "Johnsonâ€“Claisen Rearrangement Reaction", "Knoevenagel Condensation Reaction", "Kornblum Oxidation Reaction", "Larock Indole Annulation", "Lemieuxâ€“Johnson Cleavage",
    "Leuckartâ€“Wallach Amination", "Madelung Cyclization", "Malaprade Oxidation", "McMurry Coupling", "Meyerâ€“Schuster Alkyne Rearrangement",
    "Michaelisâ€“Arbuzov Phosphonate Synthesis", "Minisci Alkylation", "Mislowâ€“Evans Rearrangement Reaction", "Nazarov Electrocyclization", "Nenitzescu Indole Synthesis Reaction",
    "Nicholas Reaction", "Overman Rearrangement Reaction", "PaternÃ²â€“BÃ¼chi Photocycloaddition", "Payne Epoxide Rearrangement", "Pfitzinger Condensation",
    "Pschorr Cyclization", "Pummerer Rearrangement Method", "Rieche Formylation Reaction", "Robinsonâ€“Gabriel Oxazole Synthesis", "Seyferthâ€“Gilbert Homologation Reaction",
    "Sommelet Formylation", "Stobbe Condensation Reaction", "Tsujiâ€“Trost Allylic Substitution", "Van Leusen Oxazole Synthesis", "Wallach Rearrangement Reaction",
    "Willgerodtâ€“Kindler Transformation", "Wohlâ€“Aue Condensation", "Woodward Cis-Hydroxylation Reaction", "Zincke Ring Opening",
    "AumÃ¼llerâ€“Cornelis Reaction", "Backvallâ€“Morken Allylation", "Baecklund Rearrangement", "Bauld Cation Radical Cyclization", "Beifuss Reaction",
    "Bellerâ€“KnÃ¶lker Amidation", "Bergbreiterâ€“Mitsuda Reaction", "Biginelliâ€“Like Cyclocondensation", "Blackâ€“Mander Reaction", "Boeckman Cyclization",
    "Boger Annulation Reaction", "Brunnerâ€“Mingos Reaction", "Buchnerâ€“Curtius Ring Expansion", "Camps Quinoline Synthesis", "Chengâ€“Prilezhaev Epoxidation",
    "Cossio Cycloaddition", "Daubenâ€“Schreiber Cyclization", "de Meijere Cyclopropanation", "DeShong Reaction", "Dondoni Three-Component Reaction",
    "Eatonâ€“Coleman Rearrangement", "Eschenmoserâ€“Tanabe Fragmentation", "Evansâ€“Chan Coupling", "Ficini Reaction", "Finkelsteinâ€“Halex Reaction",
    "Fischerâ€“Japp Cyclization", "Forbes Rearrangement", "Fujimotoâ€“Belleau Rearrangement", "GagnÃ© Cycloisomerization", "Gassman Pyrrole Synthesis",
    "Gassmanâ€“Knoff Cyclization", "Gerlach Modification", "Gleasonâ€“Johnson Rearrangement", "Gompperâ€“Mannich Reaction", "Gribble Indole Synthesis",
    "Hassner Aziridination", "Heine Reaction", "Henkel Reaction", "Hickinbottom Rearrangement", "Hirao Coupling",
    "HofslÃ¸kkenâ€“SkattebÃ¸l Rearrangement", "Houseâ€“Meinwald Rearrangement", "Itoâ€“Saegusa Oxidation", "Juliaâ€“Lythgoe Modification", "Kabalka Reduction",
    "Kendeâ€“Smith Annulation", "KÃ¼rti Amination", "Liebeskind Lactonization", "Mannichâ€“Speyer Reaction", "Meyers Bicyclic Annulation",
    "Moffattâ€“Swern Modification", "Mukaiyamaâ€“Hosomi Reaction", "Murai Reaction", "Nysted Olefination", "Okamotoâ€“Brown Allylation",
    "Paquette Cyclization", "Parhamâ€“Friedman Cyclization", "Pausacker Reaction", "Pincock Rearrangement", "Rapoport Reaction",
    "Rapoportâ€“Leibman Reaction", "Ritterâ€“Weerman Reaction", "Roushâ€“Masamune Aldol Reaction", "Schmidtâ€“AubÃ© Reaction", "Semmelhack Reaction",
    "Semmlerâ€“Wolff Aromatization", "Smith Cyclopropanation", "Sugasawa Annulation", "Taber Cyclization", "Toste Rearrangement",
    "Ullmannâ€“Biellmann Coupling", "Wenkert Reaction", "Wenkertâ€“Oshima Coupling", "Westphalen Rearrangement", "Wiberg Oxidation",
    "Wulffâ€“DÃ¶tz Annulation", "Yamamotoâ€“Peterson Olefination", "Yus Reduction", "Zbiral Reaction", "Zieglerâ€“Hafner Synthesis",
    "AbbÃ© Condensation", "Acheson Indole Synthesis", "Adamkiewicz Reaction", "Akabori Reduction", "Alder Ene Cyclization",
    "Algarâ€“Flynnâ€“Oyamada Oxidation", "Anelliâ€“Montanari Oxidation", "Arndtâ€“Eistert Homologation", "Asinger Multicomponent Reaction", "Atkinson Fragmentation",
    "Aza-Cope Rearrangement Reaction", "Baldwin Cyclization Rules", "Bang Reaction", "Barton Olefination", "BÃ©champ Reduction Method",
    "Beller Amination", "Bergiusâ€“Bergmann Reduction", "Bingel Cyclopropanation", "Blanc Reaction", "Bohlmannâ€“Rahtz Pyridine Formation",
    "Boultonâ€“Katritzky Rearrangement Reaction", "Bouveault Reduction", "Bradsher Cyclization", "Bucherer Transformation", "Cadiot Alkynyl Coupling",
    "Campbell Cyclization", "Carroll Rearrangement Reaction", "Castroâ€“Stephens Alkynylation", "Chichibabin Pyridine Reaction", "Cope Rearrangement Reaction",
    "Coreyâ€“Kim Oxidation Method", "Coreyâ€“Seebach Umpolung", "Craig Method Rearrangement", "Criegee Oxidative Cleavage", "Curtius Degradation",
    "Dauben Oxidation Reaction", "DCC Coupling", "De Mayo Photocycloaddition", "Dessâ€“Martin Periodinane Oxidation", "Djerassi Oxidation",
    "Doebnerâ€“Miller Quinoline Synthesis", "Duff Ortho Formylation", "Edman Protein Degradation", "Eschweilerâ€“Clarke Reductive Methylation", "Favorskii Ring Contraction",
    "Feistâ€“Benary Furan Synthesis", "Fischerâ€“Hepp Rearrangement Reaction", "Frankland Reaction", "Friedelâ€“Crafts Acylation Reaction", "Fukuyama Thioester Reduction",
    "Ganem Amination", "Gattermannâ€“Adams Reaction", "Geissmanâ€“Waiss Rearrangement Reaction", "Gilman Reagent Coupling", "Glaser Oxidative Coupling",
    "Goldberg Coupling", "Grieco Elimination Reaction", "Hauser Annulation Reaction", "Heck Cross Coupling", "Hellâ€“Volhardâ€“Zelinsky Halogenation",
    "Hinsberg Test Reaction", "Hoesch Condensation", "Hornerâ€“Emmons Reaction", "Hunsdiecker Decarboxylative Halogenation", "Jacobsenâ€“Katsuki Asymmetric Epoxidation",
    "Johnsonâ€“Claisen Rearrangement Reaction", "Knoevenagel Condensation Reaction", "Kornblum Oxidation Reaction", "Larock Indole Annulation", "Lemieuxâ€“Johnson Cleavage",
    "Leuckartâ€“Wallach Amination", "Madelung Cyclization", "Malaprade Oxidation", "McMurry Coupling", "Meyerâ€“Schuster Alkyne Rearrangement",
    "Michaelisâ€“Arbuzov Phosphonate Synthesis", "Minisci Alkylation", "Mislowâ€“Evans Rearrangement Reaction", "Nazarov Electrocyclization", "Nenitzescu Indole Synthesis Reaction",
    "Nicholas Reaction", "Overman Rearrangement Reaction", "PaternÃ²â€“BÃ¼chi Photocycloaddition", "Payne Epoxide Rearrangement", "Pfitzinger Condensation",
    "Pschorr Cyclization", "Pummerer Rearrangement Method", "Rieche Formylation Reaction", "Robinsonâ€“Gabriel Oxazole Synthesis", "Seyferthâ€“Gilbert Homologation Reaction",
    "Sommelet Formylation", "Stobbe Condensation Reaction", "Tsujiâ€“Trost Allylic Substitution", "Van Leusen Oxazole Synthesis", "Wallach Rearrangement Reaction",
    "Willgerodtâ€“Kindler Transformation", "Wohlâ€“Aue Condensation", "Woodward Cis-Hydroxylation Reaction", "Zincke Ring Opening",
    "Alderâ€“Rickert Retro-Dielsâ€“Alder Reaction", "Aza-Brook Rearrangement", "Bamfordâ€“Stevens Shapiro Modification", "Bartonâ€“de Mayo Reaction", "Barton Pyridine Deoxygenation",
    "Bayerâ€“Emmerling Indigo Reaction", "Beckmann Fragmentation", "Benzidine Rearrangement", "Bergmann Cycloaromatization Reaction", "Bischlerâ€“Napieralski Isoquinoline Synthesis",
    "Bohlmann Pyrrolizidine Synthesis", "Boultonâ€“Katritzky Ring Transformation", "Bredereck Imine Synthesis", "Buchererâ€“Bergs Hydantoin Synthesis", "Camps Cyclization",
    "Carpino Amino Acid Coupling", "Castagnoliâ€“Cushman Condensation", "Chattaway Reaction", "Ciamicianâ€“Dennstedt Pyrrole Expansion", "Conradâ€“Limpach Quinoline Cyclization",
    "Coreyâ€“Fuchs Alkyne Synthesis", "Craig Rearrangement Reaction", "Dakinâ€“West Amino Acid Synthesis", "Danheiser Annulation Reaction", "de Meijere Rearrangement",
    "DelÃ©pine Amine Synthesis Reaction", "Djerassiâ€“Barton Deamination", "Eschenmoserâ€“Claisen Rearrangement", "Eschenmoser Methenylation Reaction", "FÃ©tizonâ€“Jury Oxidation Method",
    "Fischerâ€“Hepp Rearrangement Method", "Friedelâ€“Crafts Sulfonylation", "Fritsch Indole Cyclization", "Gassman Oxindole Synthesis", "Gattermann Cyanation",
    "Geissmanâ€“Waiss Lactone Rearrangement", "Gryko Pyrrole Synthesis", "Hammick Reaction Decarboxylation", "Hantzsch Pyridine Cyclocondensation", "Haworth Phenanthrene Cyclization",
    "Heckâ€“Matsuda Arylation Reaction", "Hinsberg Sulfonamide Formation", "Hofmannâ€“LÃ¶fflerâ€“Freytag Reaction", "Houseâ€“Meinwald Rearrangement Reaction", "Imamoto Organophosphorus Reaction",
    "Jappâ€“Maitland Condensation", "Kaganâ€“Mislow Rearrangement", "Kende Annulation", "Knorr Pyrazole Synthesis", "Koenigsâ€“Knorr Glycosylation",
    "KrÃ¶hnke Pyridine Condensation", "Leimgruberâ€“Batcho Indole Cyclization", "Lemieuxâ€“Johnson Oxidative Cleavage", "Lobry de Bruynâ€“van Ekenstein Transformation", "Madelung Indole Cyclization",
    "Mannichâ€“Doebner Condensation", "Meyerâ€“Schuster Rearrangement Method", "Michaelisâ€“Becker Phosphonate Synthesis", "Mislowâ€“Evans Sulfoxide Rearrangement", "Nenitzescu Indole Cyclization",
    "Niementowski Quinazoline Synthesis", "Padwa Cyclization Cascade", "Parham Intramolecular Cyclization", "Pausonâ€“Khand Carbonylative Cyclization", "Pechmann Coumarin Synthesis",
    "Pfitzinger Quinoline Condensation", "Pinner Salt Reaction", "Polonovskiâ€“Potier Rearrangement", "Prinsâ€“Ritter Reaction", "Radziszewski Imidazole Condensation",
    "Reissertâ€“Henze Reaction", "Robinsonâ€“SchÃ¶pf Tropinone Synthesis", "Sakurai Allylsilane Reaction", "Schmidtâ€“AubÃ© Lactam Rearrangement", "Semmlerâ€“Wolff Aromatization Reaction",
    "Sommeletâ€“Hauser Rearrangement Method", "Stobbe Ester Condensation", "Tiemannâ€“Reimer Formylation", "Tsuji Carbonylation Reaction", "Ullmann Ether Synthesis",
    "Van Leusen Pyrrole Synthesis", "Wallach Oxidative Rearrangement", "Wenker Aziridine Formation", "Wohlâ€“Aue Phenazine Synthesis", "Zinckeâ€“Koenig Reaction",
    "Abeâ€“Mori Reaction", "Abramovich Reaction", "Acheson Cyclization", "Akiyamaâ€“Mukaiyama Aldol Reaction", "Alcaide Cyclization",
    "Allredâ€“Rochow Reaction", "Alperâ€“Kagan Reaction", "Anelliâ€“Montanari Oxidation", "Anion Accelerated Claisen Rearrangement", "Arbuzovâ€“Michaelis Reaction",
    "Atkinson Rearrangement", "BÃ¤cklund Transformation", "Baldwinâ€“Whitehead Lactonization", "Banert Cascade Rearrangement", "Barluenga Aziridination",
    "Bartonâ€“Zard Pyrrole Annulation", "Bashaâ€“Lipton Reduction", "Bayerâ€“Villiger Lactonization", "Bechamp Reduction Method", "Bergmannâ€“PlÃ¶chl Azlactone Synthesis",
    "Birkoferâ€“Ritter Reaction", "Boger Hetero Dielsâ€“Alder Reaction", "Bonnemaâ€“van Tamelen Cyclization", "Bourgeois Reaction", "Bredereckâ€“Simchen Alkylation",
    "Brunner Pyrrolidine Synthesis", "Cairncross Alkylation", "Caple Rearrangement", "Carreira Zinc Alkynylation", "Charette Cyclopropanation Reaction",
    "Chattaway Nitrosation", "Clive Reduction", "Combes Quinoline Cyclization", "Coreyâ€“Enders Epoxidation", "Coreyâ€“Noeâ€“Lin Reduction",
    "Cornforth Oxidation", "Cossyâ€“Micheli Cyclization", "Daubenâ€“Salzer Cyclization", "Davidson Pyridine Synthesis", "Delepineâ€“Moffatt Modification",
    "Deslongchamps Oxidation", "Doyleâ€“Kirmse Reaction", "Effenberger Ring Closure", "Enders Hydrazone Alkylation Method", "Evansâ€“Tishchenko Reduction",
    "Fischerâ€“Oxa Pictetâ€“Spengler Reaction", "Fujimotoâ€“Belleau Cyclization", "Ganem Î²-Lactam Synthesis", "Gassman Indole Annulation", "Gilmanâ€“Speeter Reaction",
    "Greene Rearrangement", "Hajosâ€“Parrishâ€“Ederâ€“Sauerâ€“Wiechert Reaction", "Hanessianâ€“Hullar Reaction", "Hayashi Coupling", "Heine Rearrangement",
    "Hoffmannâ€“LÃ¶ffler Cyclization", "Irelandâ€“Claisen Ester Rearrangement", "Ito Cyclization", "Kaganâ€“Ando Olefination", "Kendeâ€“Smith Rearrangement",
    "Kraus Annulation", "Lautens Annulation", "Mander Esterification", "Marshall Allenylation", "Meyers Bicyclic Lactam Synthesis",
    "Moffattâ€“Pfitzner Oxidation Method", "Mukaiyamaâ€“Corey Reaction", "Murai Carbonylation", "Narasakaâ€“Sharpless Reduction", "Nysted Methylenation",
    "Oppolzer Sultam Alkylation", "Padwa Annulation", "Pfaltz Allylic Substitution", "Rapoportâ€“Leibman Alkynylation", "Roush Crotylboration Reaction",
    "Sampson Cyclization", "Schlosserâ€“Corey Modification", "Schreiber Glycosylation", "Semmelhackâ€“Hilton Reaction", "Shibasaki Michael Addition",
    "Stillâ€“Wittig Rearrangement Method", "Taber Radical Cyclization", "Tamuraâ€“Kochi Coupling", "Tius Nazarov Cyclization", "Tomioka Conjugate Addition",
    "Wender Cycloaddition", "Yamaguchiâ€“Inanaga Esterification", "Yoon [2+2] Cycloaddition", "Zard Radical Addition", "Zimmermanâ€“O'Connell Rearrangement",
    "Achesonâ€“Meldrum Synthesis", "AubÃ© Schmidt Reaction", "Baldwinâ€“Whitehead Rule", "Bamfordâ€“Stevens Decomposition", "Barton Hydrazone Decomposition",
    "BÃ©champâ€“Mills Reaction", "Bergmannâ€“Michels Cyclization", "Bersonâ€“Willcott Rearrangement", "Blechert Ring-Closing Metathesis", "Bode Salt Reaction",
    "Boger Azadiene Cycloaddition", "Bourgeoisâ€“Mills Reaction", "Bredereck Reagent Formylation", "Brookâ€“Mukaiyama Aldol Reaction", "Camps Indole Synthesis",
    "Charetteâ€“Gem-Dizinc Cyclopropanation", "Chengâ€“Brown Allylation", "Claisenâ€“Ireland Ester Rearrangement", "Cookâ€“Heilbron Reaction", "Coreyâ€“Nicolaou Lactonization",
    "Daubenâ€“Kellogg Olefination", "Dielsâ€“Alderâ€“Alder Rearrangement", "Donohoe Syn-Dihydroxylation", "Doyle Carbene Insertion", "Eaton Rearrangement",
    "Effenberger Cyclopropanation", "Endersâ€“SAMP Hydrazone Alkylation", "Evansâ€“Mukaiyama Aldol Reaction", "Ficini [2+2] Cycloaddition", "Franckâ€“Condon Photochemical Process",
    "Friedelâ€“Crafts Hydroxyethylation", "Fukuyamaâ€“Mitsunobu Reaction", "Gassmanâ€“West Cyclization", "Gassman Oxazole Synthesis", "Gribble Pyrrole Synthesis",
    "Hammondâ€“Postulate Rearrangement", "Hassnerâ€“Moser Aziridination", "Heckâ€“Jeffery Arylation", "Huisgen Ene Reaction", "Imamotoâ€“Yamaguchi Phosphorylation",
    "Johnsonâ€“Coreyâ€“Chaykovsky Epoxidation", "Kaganâ€“Mislow Rearrangement", "Kendeâ€“Molander Cyclization", "KÃ¼rti Hydroxylation", "Larock Benzofuran Synthesis",
    "Lemieuxâ€“von Rudloff Oxidative Cleavage", "Liebeskind Ketone Synthesis", "Marshallâ€“Tamaru Allylation", "Masamuneâ€“Roush Modification", "Meyers Enolate Alkylation",
    "Morken Platinum Diboration", "Noyoriâ€“Ikariya Transfer Hydrogenation", "Oppolzer Camphorsultam Reaction", "Padwaâ€“Dimitroff Cyclization", "Parhamâ€“Heck Cyclization",
    "Pfaltz Asymmetric Hydrogenation", "Rapoportâ€“Leibman Homologation", "Roushâ€“Brown Allylation", "Rychnovsky Acetonide Rearrangement", "Schreiberâ€“Nicholaou Glycosylation",
    "Seebachâ€“Dakin West Reaction", "Semmelhack Palladium Oxidation", "Shibasaki Heterobimetallic Catalysis", "Stillâ€“Gennari Modification", "Taber Annulation",
    "Tius Oxy-Nazarov Cyclization", "Ugiâ€“JoulliÃ© Reaction", "Wender [5+2] Cycloaddition", "Yamaguchi Mixed Anhydride Method", "Yoon Photoredox Cycloaddition",
    "Zard Xanthate Transfer Reaction", "Zweifel Hydroborationâ€“Olefination"
  ];

  advancedReactionsList.forEach(name => {
      let setupFn;
      let desc = "[Organic Synthesis] Specialized Named Organic Reaction. IUPAC Synthesis Pathway. Involves C, H, O, N elements.";
      
      // Assign dynamic generic 3D setups based on keyword classification
      if (name.includes("Oxidation") || name.includes("Epoxidation")) {
          desc = "[Oxidation] Mechanism involving an increase in oxidation state. Elements: Carbon (C), Hydrogen (H), Oxygen (O). Common Catalysts/Reagents: Osmium Tetroxide (OsO4), Potassium Permanganate (KMnO4), mCPBA, Chromium (Cr).";
          setupFn = (g) => {
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'substrate'));
              g.add(createAtom(oMat, 0.35, new THREE.Vector3(2, 0, 0), 'oxidant'));
              g.add(createAtom(oMat, 0.35, new THREE.Vector3(0, 1, 0), 'oxygenLeaving'));
          };
      } else if (name.includes("Reduction") || name.includes("Deoxygenation") || name.includes("Degradation") || name.includes("Hydrogenation")) {
          desc = "[Reduction] Mechanism involving a decrease in oxidation state. Elements: Carbon (C), Hydrogen (H), Oxygen (O). Common Catalysts: Palladium on Carbon (Pd/C), Platinum (Pt), Nickel (Ni), Lithium Aluminum Hydride (LiAlH4), NaBH4.";
          setupFn = (g) => {
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-0.5, 0, 0), 'substrate'));
              g.add(createAtom(oMat, 0.4, new THREE.Vector3(0.5, 0, 0), 'oxygenLeaving'));
              g.add(createAtom(steel, 0.3, new THREE.Vector3(-2, 0, 0), 'pdCatalyst'));
          };
      } else if (name.includes("Rearrangement") || name.includes("Shift") || name.includes("Transformation")) {
          desc = "[Rearrangement] [Carbocation] Intramolecular structural reorganization mechanism. Isomerization. Elements: Carbon (C), Hydrogen (H). Involves Carbocation or Carbanion intermediates and stereochemical shifts.";
          setupFn = (g) => {
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'substrate'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(0, 0, 0), 'substrate'));
              g.add(createAtom(oMat, 0.3, new THREE.Vector3(1, 0, 0), 'substrate'));
              g.add(createAtom(cMat, 0.3, new THREE.Vector3(-1, 1, 0), 'migrateGroup'));
          };
      } else if (name.includes("Coupling") || name.includes("Catalytic")) {
          desc = "[Coupling] Transition-metal catalyzed cross-coupling pathway. Elements: Carbon (C), Halogens (F, Cl, Br, I), Boron (B), Tin (Sn). Catalysts: Palladium (Pd), Nickel (Ni), Copper (Cu), Rhodium (Rh).";
          setupFn = (g) => {
              g.add(createAtom(steel, 0.35, new THREE.Vector3(0, 1, 0), 'pdCatalyst'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1.5, 0, 0), 'nucleophile'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(1.5, 0, 0), 'leavingGroup'));
          };
      } else if (name.includes("Condensation") || name.includes("Synthesis") || name.includes("Annulation") || name.includes("Homologation") || name.includes("Addition") || name.includes("Formylation")) {
          desc = "[Condensation] Complex condensation, synthesis, or addition mechanism. IUPAC structural homologation. Elements: Carbon (C), Hydrogen (H), Nitrogen (N), Oxygen (O). Often involves loss of Water (H2O).";
          setupFn = (g) => {
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'substrate1'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'substrate2'));
              g.add(createAtom(oMat, 0.3, new THREE.Vector3(0, 1, 0), 'waterLeaving'));
              g.add(createBond(new THREE.Vector3(0,0,0), {x:0,y:0,z:Math.PI/2}, 0.5, 'cycloBond'));
          };
      } else if (name.includes("Polymerization")) {
          desc = "[Polymerization] Catalytic chain growth polymerization. Elements: Carbon (C), Hydrogen (H). Catalysts: Ziegler-Natta (Titanium Ti / Aluminum Al), Radical Initiators (AIBN), Ruthenium (Ru).";
          setupFn = (g) => {
              g.add(createAtom(steel, 0.4, new THREE.Vector3(0, 1, 0), 'pdCatalyst'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-2, 0, 0), 'monomer'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(2, 0, 0), 'monomer'));
              g.add(createBond(new THREE.Vector3(-1, 0, 0), {x:0,y:0,z:Math.PI/2}, 1, 'polymerBond'));
              g.add(createBond(new THREE.Vector3(1, 0, 0), {x:0,y:0,z:Math.PI/2}, 1, 'polymerBond'));
          };
      } else if (name.includes("Cyclization") || name.includes("Cycloaddition") || name.includes("Expansion")) {
          desc = "[Cyclization] Ring formation, expansion, or pericyclic cycloaddition mechanism. Elements: Carbon (C), Hydrogen (H), Oxygen (O), Nitrogen (N). Involves aromaticity and IUPAC ring naming protocols.";
          setupFn = (g) => {
              for(let i=0; i<6; i++) g.add(createAtom(cMat, 0.3, new THREE.Vector3(i*0.6 - 1.5, 0, 0), 'foldingChain'));
              g.add(createBond(new THREE.Vector3(0,0,0), null, 1.2, 'tsRing'));
          };
      } else if (name.includes("Elimination") || name.includes("Cleavage") || name.includes("Fragmentation") || name.includes("Decarboxylation") || name.includes("Dehydration") || name.includes("Photolysis")) {
          desc = "[Elimination] Bond breaking mechanism leading to elimination or fragmentation. E1/E2 pathways. Elements: Carbon (C), Hydrogen (H), Oxygen (O). Common leaving groups: Halogens (Cl, Br, I), Tosylates (OTs). Loss of CO2 or H2O.";
          setupFn = (g) => {
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-0.5, 0, 0), 'substrate'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(0.5, 0, 0), 'substrate'));
              g.add(createAtom(hMat, 0.25, new THREE.Vector3(-0.5, -1, 0), 'leavingGroupH'));
              g.add(createAtom(oMat, 0.35, new THREE.Vector3(0.5, 1, 0), 'leavingGroupX'));
              g.add(createBond(new THREE.Vector3(0, 0.15, 0), {x:0,y:0,z:Math.PI/2}, 1, 'piBond'));
          };
      } else {
          desc = "[Substitution] Radical, Electrophilic, or Nucleophilic substitution pathway. SN1/SN2 IUPAC mechanism. Elements: Carbon (C), Halogens (F, Cl, Br, I), Oxygen (O), Nitrogen (N), Sulfur (S).";
          setupFn = (g) => {
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(-1, 0, 0), 'substrate'));
              g.add(createAtom(cMat, 0.4, new THREE.Vector3(1, 0, 0), 'nucleophile'));
          };
      }

      reactionList.push({ name: name, desc: desc, setup: setupFn });
  });

  // Grid Layout logic
  const gridWidth = 5;
  const spacingX = 6;
  const spacingZ = 6;

  reactionList.forEach((rxn, index) => {
      const rxnName = typeof rxn === 'string' ? rxn : rxn.name;
      const machineId = 'organic_' + rxnName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      if (requestedId && requestedId !== machineId && requestedId !== 'organic_reactions' && requestedId !== 'organic_chemistry') return;

      const rxnGroup = new THREE.Group();
      
      const row = Math.floor(index / gridWidth);
      const col = index % gridWidth;
      
      const posX = (col - (gridWidth-1)/2) * spacingX;
      const posZ = row * spacingZ;
      rxnGroup.position.set(posX, 0, posZ);
      
      // Setup the geometry for this specific reaction
      rxn.setup(rxnGroup);
      
      // Add a base plate for presentation
      const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.1, 32), darkSteel);
      base.position.set(0, -1.5, 0);
      rxnGroup.add(base);

      group.add(rxnGroup);
      
      parts.push({
          name: rxn.name,
          description: rxn.desc,
          material: 'Organics',
          function: 'Chemical Mechanism',
          assemblyOrder: index + 1,
          connections: [],
          failureEffect: 'If a catalyst, substrate, or optimal thermodynamic condition goes missing or fails, the reaction yield drops to 0%, toxic byproducts are formed, and downstream synthesis cascades collapse.',
          cascadeFailures: ['Overall Synthesis Yield', 'Stereochemical Purity', 'Reaction Rate'],
          originalPosition: {x: posX, y: 0, z: posZ},
          explodedPosition: {x: posX, y: 4, z: posZ}
      });
  });

  const quizQuestions = [
    { question: 'In an SN2 substitution, the nucleophile attacks from which direction relative to the leaving group?', options: ['Frontside', 'Backside', 'Orthogonal', 'Random'], correct: 1, explanation: 'SN2 involves a concerted backside attack causing stereochemical inversion.', difficulty: 'basic' },
    { question: 'What is the characteristic intermediate formed during a Wittig reaction?', options: ['Carbocation', 'Oxaphosphetane', 'Epoxide', 'Enolate'], correct: 1, explanation: 'The ylide and carbonyl form a 4-membered oxaphosphetane ring which collapses to an alkene.', difficulty: 'advanced' },
    { question: 'Which metal catalyst is commonly used in Suzuki, Heck, and Sonogashira couplings?', options: ['Iron (Fe)', 'Palladium (Pd)', 'Platinum (Pt)', 'Gold (Au)'], correct: 1, explanation: 'Palladium is the standard transition metal catalyst for these cross-coupling reactions.', difficulty: 'expert' },
    { question: 'A Diels-Alder reaction forms what size of ring?', options: ['3-membered', '4-membered', '5-membered', '6-membered'], correct: 3, explanation: 'It is a [4+2] cycloaddition that always forms a cyclohexene (6-membered) ring.', difficulty: 'basic' },
    { question: 'What does the Baeyer-Villiger reaction oxidize?', options: ['Alcohols to Ketones', 'Ketones to Esters', 'Alkenes to Epoxides', 'Aldehydes to Acids'], correct: 1, explanation: 'A peroxyacid inserts an oxygen atom next to the carbonyl carbon, converting a ketone into an ester.', difficulty: 'advanced' },
    { question: 'In the Birch reduction, an aromatic ring is reduced to a non-conjugated diene using what reagent?', options: ['H2 and Pd', 'LiAlH4', 'Na or Li in liquid NH3', 'Zn(Hg) and HCl'], correct: 2, explanation: 'Solvated electrons from an alkali metal in liquid ammonia drive the 1,4-reduction of the ring.', difficulty: 'expert' }
  ];

  return {
    group, parts, description: 'Comprehensive Library of 30 Organic Reaction Mechanisms.', quizQuestions,
    animate(time, speed, meshes) {
      const t = time * speed;
      
      meshes.forEach((meshInfo, i) => {
          if (!meshInfo || !meshInfo.group) return;
          const rxnGrp = meshInfo.group;
          
          // Global 3D Rotation & Tilting (Superior to AC/Engine)
          rxnGrp.rotation.y = t * 0.8 + (i * 0.1);
          rxnGrp.rotation.z = Math.sin(t * 0.5 + i) * 0.3;
          rxnGrp.rotation.x = Math.cos(t * 0.4 + i) * 0.2;
          
          rxnGrp.children.forEach(child => {
              if(!child.userData || !child.userData.role) return;
              
              const role = child.userData.role;
              const basePos = child.userData.basePos;
              
              if (role === 'nucleophile' || role === 'grignardR') {
                  child.position.x = basePos.x + Math.max(0, Math.sin(t * 3)) * 1.5;
              } else if (role === 'leavingGroup' || role === 'waterLeaving' || role === 'oxygenLeaving' || role === 'leavingGroupX' || role === 'leavingGroupH') {
                  child.position.y = basePos.y + Math.max(0, Math.sin(t * 3 - Math.PI)) * 1.5;
                  child.material.opacity = 1 - Math.max(0, Math.sin(t * 3 - Math.PI));
                  child.material.transparent = true;
              } else if (role === 'piBond' || role === 'cycloBond' || role === 'tsRing') {
                  child.scale.y = child.userData.baseScale * (0.5 + 0.5 * Math.sin(t * 5));
                  child.material.opacity = 0.4 + 0.4 * Math.cos(t * 5);
                  child.material.transparent = true;
              } else if (role.includes('Catalyst')) {
                  child.position.y = basePos.y + Math.sin(t * 4) * 0.3;
              } else if (role === 'migrateGroup') {
                  child.position.x = basePos.x + Math.sin(t * 2) * 1.0;
              } else if (role === 'foldingChain' || role === 'peri') {
                  // Cyclization effect: move atoms inward
                  const offset = Math.max(0, Math.sin(t * 2)) * 0.5;
                  child.position.x = basePos.x > 0 ? basePos.x - offset : basePos.x + offset;
                  child.position.y = basePos.y - offset;
              } else if (role === 'solvatedElectron' || role === 'electronLoss') {
                  child.position.y = basePos.y + Math.sin(t * 10) * 0.5;
                  child.position.x = basePos.x + Math.cos(t * 15) * 0.5;
                  const scale = 0.5 + 0.5 * Math.sin(t * 20);
                  child.scale.set(scale, scale, scale);
              } else if (role === 'baseAttack') {
                  child.position.x = basePos.x - Math.max(0, Math.sin(t * 3)) * 1.0;
              } else if (role === 'polymerBond') {
                  child.scale.y = child.userData.baseScale + Math.sin(t * 4) * 0.5;
              }
          });
      });
    }
  };
}
