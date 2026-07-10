import re

app_js_path = r'C:\Users\Saket\OneDrive\Desktop\engineering-simulator\app.js'

with open(app_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Imports
new_imports = '''
import { createCarbonNanotubeAssembler } from './machines/carbon_nanotube_assembler.js';
import { createDnaOrigamiFabricator } from './machines/dna_origami_fabricator.js';
import { createGrapheneSheetSynthesizer } from './machines/graphene_sheet_synthesizer.js';
import { createNanoscaleMolecularMotor } from './machines/nanoscale_molecular_motor.js';
import { createTargetedDrugDeliveryNanobot } from './machines/targeted_drug_delivery_nanobot.js';
import { createSolarSystemOrrery } from './machines/solar_system_orrery.js';
import { createBlackHoleAccretion } from './machines/black_hole_accretion.js';
import { createPulsarStar } from './machines/pulsar_star.js';
import { createDysonSphere } from './machines/dyson_sphere.js';
import { createJamesWebbTelescope } from './machines/james_webb_telescope.js';
import { createTornadoVortex } from './machines/tornado_vortex.js';
import { createHurricaneEye } from './machines/hurricane_eye.js';
import { createDopplerRadar } from './machines/doppler_radar.js';
import { createWeatherBalloon } from './machines/weather_balloon.js';
import { createBarometricPressureSystem } from './machines/barometric_pressure_system.js';
import { createPenicillinMolecule } from './machines/penicillin_molecule.js';
import { createMRNAVaccineLNP } from './machines/mrna_vaccine_lipid_nanoparticle.js';
import { createTabletCompressionMachine } from './machines/tablet_compression_machine.js';
import { createPillCoatingDrum } from './machines/pill_coating_drum.js';
import { createProteinKinaseInhibitor } from './machines/protein_kinase_inhibitor.js';
import { createBacteriophageVirus } from './machines/bacteriophage_virus.js';
import { createEColiBacterium } from './machines/e_coli_bacterium.js';
import { createCrisprCas9Complex } from './machines/crispr_cas9_complex.js';
import { createMitochondriaPowerhouse } from './machines/mitochondria_powerhouse.js';
import { createRibosomeTranslation } from './machines/ribosome_translation.js';
'''

if 'createCarbonNanotubeAssembler' not in content:
    content = new_imports + '\n' + content

# Machines
new_machines = '''
  { id: 'carbon_nanotube_assembler', name: 'Carbon Nanotube Assembler', creator: createCarbonNanotubeAssembler },
  { id: 'dna_origami_fabricator', name: 'DNA Origami Fabricator', creator: createDnaOrigamiFabricator },
  { id: 'graphene_sheet_synthesizer', name: 'Graphene Sheet Synthesizer', creator: createGrapheneSheetSynthesizer },
  { id: 'nanoscale_molecular_motor', name: 'Nanoscale Molecular Motor', creator: createNanoscaleMolecularMotor },
  { id: 'targeted_drug_delivery_nanobot', name: 'Targeted Drug Delivery Nanobot', creator: createTargetedDrugDeliveryNanobot },
  { id: 'solar_system_orrery', name: 'Solar System Orrery', creator: createSolarSystemOrrery },
  { id: 'black_hole_accretion', name: 'Black Hole Accretion Disk', creator: createBlackHoleAccretion },
  { id: 'pulsar_star', name: 'Pulsar Star', creator: createPulsarStar },
  { id: 'dyson_sphere', name: 'Dyson Sphere', creator: createDysonSphere },
  { id: 'james_webb_telescope', name: 'James Webb Space Telescope', creator: createJamesWebbTelescope },
  { id: 'tornado_vortex', name: 'Tornado Vortex', creator: createTornadoVortex },
  { id: 'hurricane_eye', name: 'Hurricane Eye Wall', creator: createHurricaneEye },
  { id: 'doppler_radar', name: 'Doppler Weather Radar', creator: createDopplerRadar },
  { id: 'weather_balloon', name: 'Radiosonde Weather Balloon', creator: createWeatherBalloon },
  { id: 'barometric_pressure_system', name: 'Barometric Pressure System', creator: createBarometricPressureSystem },
  { id: 'penicillin_molecule', name: 'Penicillin Molecule', creator: createPenicillinMolecule },
  { id: 'mrna_vaccine_lipid_nanoparticle', name: 'mRNA Vaccine LNP', creator: createMRNAVaccineLNP },
  { id: 'tablet_compression_machine', name: 'Tablet Compression Machine', creator: createTabletCompressionMachine },
  { id: 'pill_coating_drum', name: 'Pill Coating Drum', creator: createPillCoatingDrum },
  { id: 'protein_kinase_inhibitor', name: 'Protein Kinase Inhibitor', creator: createProteinKinaseInhibitor },
  { id: 'bacteriophage_virus', name: 'Bacteriophage Virus', creator: createBacteriophageVirus },
  { id: 'e_coli_bacterium', name: 'E. coli Bacterium', creator: createEColiBacterium },
  { id: 'crispr_cas9_complex', name: 'CRISPR-Cas9 Complex', creator: createCrisprCas9Complex },
  { id: 'mitochondria_powerhouse', name: 'Mitochondria Powerhouse', creator: createMitochondriaPowerhouse },
  { id: 'ribosome_translation', name: 'Ribosome Translation', creator: createRibosomeTranslation },
'''

if 'id: \\'carbon_nanotube_assembler\\'' not in content:
    content = content.replace('const MACHINES = [', 'const MACHINES = [\n' + new_machines)

# Categories Map
new_categories = '''
  nanotechnology: ['carbon_nanotube_assembler', 'dna_origami_fabricator', 'graphene_sheet_synthesizer', 'nanoscale_molecular_motor', 'targeted_drug_delivery_nanobot'],
  astrophysics: ['solar_system_orrery', 'black_hole_accretion', 'pulsar_star', 'dyson_sphere', 'james_webb_telescope'],
  meteorology: ['tornado_vortex', 'hurricane_eye', 'doppler_radar', 'weather_balloon', 'barometric_pressure_system'],
  pharmacology: ['penicillin_molecule', 'mrna_vaccine_lipid_nanoparticle', 'tablet_compression_machine', 'pill_coating_drum', 'protein_kinase_inhibitor'],
  microbiology: ['bacteriophage_virus', 'e_coli_bacterium', 'crispr_cas9_complex', 'mitochondria_powerhouse', 'ribosome_translation'],
'''

if 'nanotechnology: [' not in content:
    content = content.replace('const CATEGORY_MAP = {', 'const CATEGORY_MAP = {\n' + new_categories)

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated app.js successfully with 25 new models for 5 domains!')
