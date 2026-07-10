// ======================================================================
// EngiSim 3D - Core Application
// Three.js scene, controls, modes, and machine management
// ======================================================================









// Batch 12: Geology

// Batch 12: Robotics

// Batch 12: Thermodynamics

// Batch 12: Optics

// Batch 12: Acoustics

// Batch 13: Environmental

// Batch 13: Biotechnology

// Batch 13: Materials

// Batch 13: Quantum

// Batch 13: Civil

// Batch 14: Marine

// Batch 14: Aerospace

// Batch 14: Petrochemical

// Batch 14: Anatomy

// Batch 14: Botany

// --- Batch 26 ---





// --- Batch 27 ---





// --- Batch 28 ---





// --- Batch 29 ---





// --- Batch 30 ---





// --- Batch 31 ---





// --- Batch 32 ---





// --- Batch 33 ---





// --- Batch 34 ---





// --- Batch 35 ---





// --- Batch 36 ---





// --- Batch 37 ---





// --- Batch 38 ---





// --- Batch 39 ---






// --- Batch 59 ---

// --- Batch 58 ---





// --- Batch 57 ---





// --- Batch 56 ---





// --- Batch 55 ---





// --- Batch 54 ---





// --- Batch 53 ---





// --- Batch 52 ---





// --- Batch 51 ---





// --- Batch 50 ---





// --- Batch 49 ---





// --- Batch 48 ---





// --- Batch 47 ---





// --- Batch 46 ---





// --- Batch 45 ---





// --- Batch 44 ---





// --- Batch 43 ---





// --- Batch 42 ---





// --- Batch 41 ---





// --- Batch 40 ---





// --- Batch 24 ---





// --- Batch 25 ---






const MACHINES = [
  // --- Batch 59 ---
  { id: 'superconducting_resonator', name: 'Superconducting Resonator', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/superconducting_resonator.js', importName: 'createSuperconductingResonator' },
  { id: 'cryogenic_low_noise_amplifier', name: 'Cryogenic Low Noise Amplifier', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/cryogenic_low_noise_amplifier.js', importName: 'createCryogenicLowNoiseAmplifier' },
  { id: 'quantum_annealer_lattice', name: 'Quantum Annealer Lattice', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_annealer_lattice.js', importName: 'createQuantumAnnealerLattice' },
  { id: 'magnetic_shielding_can', name: 'Magnetic Shielding Can', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/magnetic_shielding_can.js', importName: 'createMagneticShieldingCan' },
  { id: 'rf_attenuator_stack', name: 'Rf Attenuator Stack', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/rf_attenuator_stack.js', importName: 'createRFAttenuatorStack' },
  { id: 'quantum_optical_parametric_oscillator', name: 'Quantum Optical Parametric Oscillator', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_optical_parametric_oscillator.js', importName: 'createOpticalParametricOscillator' },
  { id: 'quantum_barium_trap', name: 'Quantum Barium Trap', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_barium_trap.js', importName: 'createBariumIonTrap' },
  { id: 'quantum_memory_crystal', name: 'Quantum Memory Crystal', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_memory_crystal.js', importName: 'createQuantumMemoryCrystal' },
  { id: 'quantum_photonic_entanglement_source', name: 'Quantum Photonic Entanglement Source', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_photonic_entanglement_source.js', importName: 'createPhotonicEntanglementSource' },
  { id: 'quantum_laser_cooling_mot', name: 'Quantum Laser Cooling Mot', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_laser_cooling_mot.js', importName: 'createLaserCoolingMOT' },
  { id: 'astro_gamma_ray_detector', name: 'Astro Gamma Ray Detector', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_gamma_ray_detector.js', importName: 'createGammaRayDetector' },
  { id: 'astro_solar_sail', name: 'Astro Solar Sail', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_solar_sail.js', importName: 'createSolarSail' },
  { id: 'astro_mars_rover', name: 'Astro Mars Rover', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_mars_rover.js', importName: 'createMarsRover' },
  { id: 'astro_laser_altimeter', name: 'Astro Laser Altimeter', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_laser_altimeter.js', importName: 'createLaserAltimeter' },
  { id: 'astro_space_tether', name: 'Astro Space Tether', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_space_tether.js', importName: 'createSpaceTether' },
  { id: 'astro_cherenkov_telescope', name: 'Astro Cherenkov Telescope', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_cherenkov_telescope.js', importName: 'createCherenkovTelescope' },
  { id: 'astro_cosmic_ray_scintillator', name: 'Astro Cosmic Ray Scintillator', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_cosmic_ray_scintillator.js', importName: 'createCosmicRayScintillator' },
  { id: 'astro_dark_matter_xenon_vat', name: 'Astro Dark Matter Xenon Vat', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_dark_matter_xenon_vat.js', importName: 'createDarkMatterXenonVat' },
  { id: 'astro_vla_antenna', name: 'Astro Vla Antenna', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astro_vla_antenna.js', importName: 'createVLAAntenna' },
  { id: 'nano_biomimetic_virus_vector', name: 'Nano Biomimetic Virus Vector', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_biomimetic_virus_vector.js', importName: 'createBiomimeticVirusVector' },
  { id: 'nano_gearbox', name: 'Nano Gearbox', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_gearbox.js', importName: 'createNanoscaleGearbox' },
  { id: 'nano_graphene_muscle', name: 'Nano Graphene Muscle', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_graphene_muscle.js', importName: 'createGrapheneMuscle' },

  // --- Batch 58 ---
  { id: 'quantum_fridge', name: 'Dilution Fridge', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/quantum_dilution_fridge.js', importName: 'createDilutionFridge' },
  { id: 'quantum_qubit', name: 'Superconducting Qubit', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/quantum_qubit_chip.js', importName: 'createQubitChip' },
  { id: 'quantum_cables', name: 'Microwave Cables', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/quantum_microwave_cables.js', importName: 'createMicrowaveCables' },
  { id: 'quantum_josephson', name: 'Josephson Junction', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/quantum_josephson_junction.js', importName: 'createJosephsonJunction' },
  { id: 'quantum_amp', name: 'Parametric Amplifier', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/quantum_parametric_amplifier.js', importName: 'createParametricAmplifier' },

  { id: 'photonic_ion', name: 'Ion Trap Vacuum', icon: '&#x2699;&#xFE0F;', category: 'quantum_photonics', importPath: './machines/quantum_ion_trap.js', importName: 'createIonTrap' },
  { id: 'photonic_proc', name: 'Photonic Processor', icon: '&#x2699;&#xFE0F;', category: 'quantum_photonics', importPath: './machines/photonic_processor.js', importName: 'createPhotonicProcessor' },
  { id: 'photonic_inter', name: 'Optical Interferometer', icon: '&#x2699;&#xFE0F;', category: 'quantum_photonics', importPath: './machines/optical_interferometer.js', importName: 'createOpticalInterferometer' },
  { id: 'photonic_detect', name: 'Photon Detector', icon: '&#x2699;&#xFE0F;', category: 'quantum_photonics', importPath: './machines/single_photon_detector.js', importName: 'createPhotonDetector' },
  { id: 'photonic_gate', name: 'Logic Gate Array', icon: '&#x2699;&#xFE0F;', category: 'quantum_photonics', importPath: './machines/quantum_logic_gate.js', importName: 'createQuantumLogicGate' },

  { id: 'astro_sunshield', name: 'Space Sunshield', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_space', importPath: './machines/astro_space_sunshield.js', importName: 'createSpaceSunshield' },
  { id: 'astro_coronagraph', name: 'Coronagraph Mask', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_space', importPath: './machines/astro_space_coronagraph.js', importName: 'createCoronagraphMask' },
  { id: 'astro_xray', name: 'X-ray Mirror', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_space', importPath: './machines/astro_space_xray_mirror.js', importName: 'createXRayMirror' },
  { id: 'astro_tracker', name: 'Star Tracker', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_space', importPath: './machines/astro_space_star_tracker.js', importName: 'createStarTracker' },
  { id: 'astro_horn', name: 'Radio Feed Horn', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_space', importPath: './machines/astro_space_radio_feed_horn.js', importName: 'createRadioFeedHorn' },

  { id: 'astro_deformable', name: 'Deformable Mirror', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_ground', importPath: './machines/astro_deformable_mirror.js', importName: 'createDeformableMirror' },
  { id: 'astro_interf_arm', name: 'LIGO Arm', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_ground', importPath: './machines/astro_interferometer_arm.js', importName: 'createInterferometerArm' },
  { id: 'astro_pmt', name: 'Neutrino PMT', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_ground', importPath: './machines/astro_neutrino_pmt.js', importName: 'createNeutrinoPMT' },
  { id: 'astro_ccd', name: 'CCD Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_ground', importPath: './machines/astro_ccd_sensor_array.js', importName: 'createCCDSensorArray' },
  { id: 'astro_grating', name: 'Spectrograph Grating', icon: '&#x2699;&#xFE0F;', category: 'astrophysics_ground', importPath: './machines/astro_spectrograph_grating.js', importName: 'createSpectrographGrating' },

  { id: 'nano_dna', name: 'DNA Nanobot', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_dna_bot.js', importName: 'createDNANanobot' },
  { id: 'nano_flagella', name: 'Flagellar Motor', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_flagellar_motor.js', importName: 'createFlagellarMotor' },
  { id: 'nano_drug', name: 'Drug Delivery Vehicle', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_drug_delivery.js', importName: 'createDrugDeliveryVehicle' },
  { id: 'nano_magnetic', name: 'Magnetic Microrobot', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_magnetic_microrobot.js', importName: 'createMagneticMicrorobot' },
  { id: 'nano_actuator', name: 'Nanotube Actuator', icon: '&#x2699;&#xFE0F;', category: 'nanorobotics', importPath: './machines/nano_carbon_nanotube_actuator.js', importName: 'createCarbonNanotubeActuator' },

  // --- Batch 57 ---
  { id: 'civil_dam_spillway', name: 'Dam Spillway', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_gravity_dam_spillway.js', importName: 'createGravityDamSpillway' },
  { id: 'civil_box_girder', name: 'Box Girder Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_box_girder_bridge_segment.js', importName: 'createBoxGirderBridgeSegment' },
  { id: 'civil_pile_driver', name: 'Pile Driver', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_precast_concrete_pile_driver.js', importName: 'createPrecastConcretePileDriver' },
  { id: 'civil_overpass', name: 'Highway Overpass', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_highway_overpass_interchange.js', importName: 'createHighwayOverpassInterchange' },
  { id: 'civil_runway', name: 'Runway Lights', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_airport_runway_lighting_system.js', importName: 'createAirportRunwayLightingSystem' },


  { id: 'elec_insulator', name: 'HV Insulator', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_high_voltage_insulator_string.js', importName: 'createHighVoltageInsulatorString' },
  { id: 'elec_sub_cable', name: 'Submarine Cable', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_submarine_power_cable.js', importName: 'createSubmarinePowerCable' },
  { id: 'elec_capacitor', name: 'Grid Capacitor', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_power_grid_capacitor_bank.js', importName: 'createPowerGridCapacitorBank' },
  { id: 'elec_sync', name: 'Sync Condenser', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_synchronous_condenser.js', importName: 'createSynchronousCondenser' },
  { id: 'elec_relay', name: 'Relay Switch', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_relay_switch_logic.js', importName: 'createRelaySwitchLogic' },

  { id: 'mech_rack', name: 'Rack & Pinion', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_rack_and_pinion.js', importName: 'createRackAndPinion' },
  { id: 'mech_ujoint', name: 'Universal Joint', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_universal_joint.js', importName: 'createUniversalJoint' },
  { id: 'mech_harmonic', name: 'Harmonic Drive', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_harmonic_drive.js', importName: 'createHarmonicDrive' },
  { id: 'mech_wankel', name: 'Wankel Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_wankel_engine.js', importName: 'createWankelEngine' },
  { id: 'mech_scotch', name: 'Scotch Yoke', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_scotch_yoke.js', importName: 'createScotchYoke' },

  { id: 'aero_bow', name: 'Bow Thruster', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_bow_thruster.js', importName: 'createShipBowThruster' },
  { id: 'aero_flap', name: 'Flap Track', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_flap_track.js', importName: 'createAirplaneFlapTrack' },
  { id: 'aero_tail', name: 'Tail Rotor', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_tail_rotor.js', importName: 'createHelicopterTailRotor' },
  { id: 'aero_pelton', name: 'Pelton Wheel', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_pelton_wheel.js', importName: 'createPeltonWheel' },
  { id: 'aero_pitot', name: 'Pitot Tube', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_pitot_tube.js', importName: 'createAircraftPitotTube' },

  // --- Batch 56 ---
  { id: 'civil_damper', name: 'Tuned Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_tuned_mass_damper.js', importName: 'createTunedMassDamper' },
  { id: 'civil_dome', name: 'Geodesic Dome', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_geodesic_dome.js', importName: 'createGeodesicDome' },
  { id: 'civil_saddle', name: 'Suspension Saddle', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_suspension_saddle.js', importName: 'createSuspensionSaddle' },
  { id: 'civil_shield_ring', name: 'Tunnel Shield Ring', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_tunneling_ring.js', importName: 'createShieldTunnelingRing' },
  { id: 'civil_crane_ring', name: 'Crane Slew Ring', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_crane_slew_ring.js', importName: 'createTowerCraneSlewRing' },


  { id: 'elec_breaker', name: 'HV Circuit Breaker', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_hv_circuit_breaker.js', importName: 'createCircuitBreaker' },
  { id: 'elec_commutator', name: 'Stator Commutator', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_stator_commutator.js', importName: 'createStatorCommutator' },
  { id: 'elec_linear_motor', name: 'Linear Motor', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_linear_induction_motor.js', importName: 'createLinearInductionMotor' },
  { id: 'elec_arc_furnace', name: 'Arc Furnace', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_arc_furnace_electrodes.js', importName: 'createArcFurnace' },
  { id: 'elec_wind_gen', name: 'Wind Nacelle Gen', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_wind_turbine_nacelle.js', importName: 'createWindTurbineGenerator' },

  { id: 'mech_geneva', name: 'Geneva Drive', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_geneva_drive.js', importName: 'createGenevaDrive' },
  { id: 'mech_roots', name: 'Roots Blower', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_roots_blower.js', importName: 'createRootsBlower' },
  { id: 'mech_diff', name: 'Differential Gear', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_differential_gear.js', importName: 'createDifferentialGear' },
  { id: 'mech_camshaft', name: 'Camshaft Follower', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_camshaft_follower.js', importName: 'createCamshaftFollower' },
  { id: 'mech_scroll', name: 'Scroll Compressor', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_scroll_compressor.js', importName: 'createScrollCompressor' },

  { id: 'aero_ballast', name: 'Submarine Ballast', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_submarine_ballast.js', importName: 'createBallastTank' },
  { id: 'aero_hydrofoil', name: 'Hydrofoil Strut', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_hydrofoil_strut.js', importName: 'createHydrofoilStrut' },
  { id: 'aero_liftfan', name: 'Hovercraft Lift Fan', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_hovercraft_lift_fan.js', importName: 'createLiftFan' },
  { id: 'aero_stator_vane', name: 'Jet Stator Vane', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aero_jet_stator_vane.js', importName: 'createStatorVane' },

  // --- Batch 55 ---
  { id: 'civil_wall', name: 'Retaining Wall', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_retaining_wall.js', importName: 'createAnchoredEarthRetainingWall' },
  { id: 'civil_locks', name: 'Canal Lock Gates', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_canal_lock_gates.js', importName: 'createCanalLockGates' },
  { id: 'civil_tetrapods', name: 'Breakwater Tetrapods', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_breakwater_tetrapods.js', importName: 'createBreakwaterTetrapodArray' },


  { id: 'elec_transformer', name: 'HV Transformer', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_hv_transformer.js', importName: 'createTransformer' },
  { id: 'elec_acgen', name: 'AC Generator', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_ac_generator.js', importName: 'createACGenerator' },
  { id: 'elec_motor', name: 'Induction Motor', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_induction_motor.js', importName: 'createInductionMotor' },
  { id: 'elec_switchgear', name: 'Substation Switchgear', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_substation_switchgear.js', importName: 'createSubstationSwitchgear' },
  { id: 'elec_faraday', name: 'Faraday Cage', icon: '&#x2699;&#xFE0F;', category: 'electrical_engineering', importPath: './machines/electrical_faraday_cage.js', importName: 'createFaradayCage' },

  { id: 'mech_planetary', name: 'Planetary Gearbox', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_planetary_gearbox.js', importName: 'createPlanetaryGearbox' },
  { id: 'mech_pump', name: 'Centrifugal Pump', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_centrifugal_pump.js', importName: 'createCentrifugalPump' },
  { id: 'mech_excavator', name: 'Excavator Arm', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_hydraulic_excavator_arm.js', importName: 'createHydraulicExcavatorArm' },
  { id: 'mech_engine', name: '4-Stroke Cylinder', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_four_stroke_engine_cylinder.js', importName: 'createFourStrokeEngineCylinder' },
  { id: 'mech_cvt', name: 'CVT Transmission', icon: '&#x2699;&#xFE0F;', category: 'mechanical_engineering', importPath: './machines/mech_cvt.js', importName: 'createCVT' },

  { id: 'aero_swashplate', name: 'Heli Swashplate', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_helicopter_swashplate.js', importName: 'createHelicopterSwashplate' },
  { id: 'aero_prop', name: 'Variable-Pitch Prop', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_variable_pitch_propeller.js', importName: 'createVariablePitchPropeller' },
  { id: 'aero_gear', name: 'Landing Gear', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_retracting_landing_gear.js', importName: 'createRetractingLandingGear' },
  { id: 'aero_reverser', name: 'Thrust Reverser', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_thrust_reverser.js', importName: 'createThrustReverser' },
  { id: 'aero_gyro', name: 'Artificial Horizon', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_gyroscopic_horizon.js', importName: 'createGyroscopicHorizon' },

  // --- Batch 54 ---



  { id: 'bridge_anchor', name: 'Suspension Anchor', icon: '&#x2699;&#xFE0F;', category: 'civil_bridges', importPath: './machines/civil_suspension_anchor.js', importName: 'createSuspensionAnchor' },
  { id: 'bridge_pylon', name: 'Cable-Stayed Pylon', icon: '&#x2699;&#xFE0F;', category: 'civil_bridges', importPath: './machines/civil_cable_stayed_pylon.js', importName: 'createCableStayedPylon' },
  { id: 'bridge_bascule', name: 'Bascule Drawbridge', icon: '&#x2699;&#xFE0F;', category: 'civil_bridges', importPath: './machines/civil_bascule_bridge.js', importName: 'createBasculeBridge' },
  { id: 'bridge_swing', name: 'Swing Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil_bridges', importPath: './machines/civil_swing_bridge.js', importName: 'createSwingBridge' },
  { id: 'bridge_truss', name: 'Truss Bridge Joint', icon: '&#x2699;&#xFE0F;', category: 'civil_bridges', importPath: './machines/civil_truss_bridge_joint.js', importName: 'createTrussBridgeJoint' },

  { id: 'audio_dynamic', name: 'Dynamic Mic', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_dynamic_mic.js', importName: 'createDynamicMic' },
  { id: 'audio_condenser', name: 'Condenser Mic', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_condenser_mic.js', importName: 'createCondenserMic' },
  { id: 'audio_ribbon', name: 'Ribbon Tweeter', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_ribbon_tweeter.js', importName: 'createRibbonTweeter' },
  { id: 'audio_gramophone', name: 'Gramophone Tonearm', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_gramophone.js', importName: 'createGramophone' },

  // --- Batch 53 ---



  { id: 'cam_imax', name: 'IMAX Projector', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/camera_imax_projector.js', importName: 'createImaxProjector' },
  { id: 'cam_mitchell', name: 'Mitchell Movement', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/mitchell_camera_movement.js', importName: 'createMitchellCamera' },
  { id: 'cam_steadicam', name: 'Steadicam Gimbal', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/steadicam_gimbal.js', importName: 'createSteadicamGimbal' },
  { id: 'cam_zoetrope', name: 'Zoetrope Animation', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/zoetrope_cylinder.js', importName: 'createZoetrope' },
  { id: 'cam_lens', name: 'Anamorphic Lens', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/anamorphic_lens.js', importName: 'createAnamorphicLens' },

  { id: 'prop_turbojet', name: 'Turbojet Engine', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_turbojet.js', importName: 'createTurbojet' },
  { id: 'prop_scramjet', name: 'Scramjet', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_scramjet.js', importName: 'createScramjet' },
  { id: 'prop_ion', name: 'Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_ion_thruster.js', importName: 'createIonThruster' },
  { id: 'prop_pulsejet', name: 'Pulsejet (V-1)', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_pulsejet.js', importName: 'createPulsejet' },
  { id: 'prop_rocket', name: 'Liquid Fuel Rocket', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_liquid_rocket.js', importName: 'createLiquidRocket' },

  // --- Batch 52 ---



  { id: 'weap_match', name: 'Matchlock Mechanism', icon: '&#x2699;&#xFE0F;', category: 'historical_weapons', importPath: './machines/weaponry_matchlock.js', importName: 'createMatchlock' },
  { id: 'weap_crossbow', name: 'Crossbow Trigger', icon: '&#x2699;&#xFE0F;', category: 'historical_weapons', importPath: './machines/weaponry_crossbow_trigger.js', importName: 'createCrossbowTrigger' },
  { id: 'weap_flint', name: 'Flintlock Firing', icon: '&#x2699;&#xFE0F;', category: 'historical_weapons', importPath: './machines/weaponry_flintlock.js', importName: 'createFlintlock' },
  { id: 'weap_wheel', name: 'Wheel-lock Mechanism', icon: '&#x2699;&#xFE0F;', category: 'historical_weapons', importPath: './machines/weaponry_wheel_lock.js', importName: 'createWheelLock' },
  { id: 'weap_cannon', name: 'Cannon Recoil System', icon: '&#x2699;&#xFE0F;', category: 'historical_weapons', importPath: './machines/weaponry_cannon_recoil.js', importName: 'createCannonRecoil' },

  { id: 'ener_offshore', name: 'Offshore Turbine', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/energy_offshore_turbine.js', importName: 'createOffshoreTurbine' },
  { id: 'ener_solar', name: 'Solar Trough', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/energy_solar_trough.js', importName: 'createSolarTrough' },
  { id: 'ener_tidal', name: 'Tidal Barrage Turbine', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/energy_tidal_barrage.js', importName: 'createTidalBarrageTurbine' },
  { id: 'ener_geo', name: 'Geothermal Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/energy_geothermal_heat_pump.js', importName: 'createGeothermalHeatPump' },
  { id: 'ener_bio', name: 'Biomass Gasifier', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/energy_biomass_gasifier.js', importName: 'createBiomassGasifier' },

  // --- Batch 51 ---



  { id: 'time_water', name: 'Water Clock', icon: '&#x2699;&#xFE0F;', category: 'historical_timekeeping', importPath: './machines/timekeeping_water_clock.js', importName: 'createWaterClock' },
  { id: 'time_pendulum', name: 'Pendulum Escapement', icon: '&#x2699;&#xFE0F;', category: 'historical_timekeeping', importPath: './machines/timekeeping_pendulum_escapement.js', importName: 'createPendulumEscapement' },
  { id: 'time_marine', name: 'Marine Chronometer', icon: '&#x2699;&#xFE0F;', category: 'historical_timekeeping', importPath: './machines/timekeeping_marine_chronometer.js', importName: 'createMarineChronometer' },
  { id: 'time_astro', name: 'Astrolabe', icon: '&#x2699;&#xFE0F;', category: 'historical_timekeeping', importPath: './machines/timekeeping_astrolabe.js', importName: 'createAstrolabe' },
  { id: 'time_incense', name: 'Incense Clock', icon: '&#x2699;&#xFE0F;', category: 'historical_timekeeping', importPath: './machines/timekeeping_incense_clock.js', importName: 'createIncenseClock' },

  { id: 'mine_drag', name: 'Dragline Excavator', icon: '&#x2699;&#xFE0F;', category: 'mining_excavation', importPath: './machines/mining_dragline_excavator.js', importName: 'createDragline' },
  { id: 'mine_bucket', name: 'Bucket-Wheel', icon: '&#x2699;&#xFE0F;', category: 'mining_excavation', importPath: './machines/mining_bucket_wheel_excavator.js', importName: 'createBucketWheelExcavator' },
  { id: 'mine_miner', name: 'Continuous Miner', icon: '&#x2699;&#xFE0F;', category: 'mining_excavation', importPath: './machines/mining_continuous_miner.js', importName: 'createContinuousMiner' },
  { id: 'mine_shuttle', name: 'Shuttle Car', icon: '&#x2699;&#xFE0F;', category: 'mining_excavation', importPath: './machines/mining_shuttle_car.js', importName: 'createShuttleCar' },
  { id: 'mine_jaw', name: 'Jaw Crusher', icon: '&#x2699;&#xFE0F;', category: 'mining_excavation', importPath: './machines/mining_jaw_crusher.js', importName: 'createJawCrusher' },

  // --- Batch 50 ---
  { id: 'tele_jwst', name: 'JWST Observatory', icon: '&#x2699;&#xFE0F;', category: 'mega_telescopes', importPath: './machines/telescope_jwst.js', importName: 'createJWST' },
  { id: 'tele_elt', name: 'Extremely Large Telescope', icon: '&#x2699;&#xFE0F;', category: 'mega_telescopes', importPath: './machines/telescope_elt.js', importName: 'createELT' },
  { id: 'tele_arecibo', name: 'Arecibo Radio Dish', icon: '&#x2699;&#xFE0F;', category: 'mega_telescopes', importPath: './machines/telescope_arecibo.js', importName: 'createArecibo' },
  { id: 'tele_hubble', name: 'Hubble Space Telescope', icon: '&#x2699;&#xFE0F;', category: 'mega_telescopes', importPath: './machines/telescope_hubble.js', importName: 'createHubble' },
  { id: 'tele_chandra', name: 'Chandra X-Ray Obs', icon: '&#x2699;&#xFE0F;', category: 'mega_telescopes', importPath: './machines/telescope_chandra.js', importName: 'createChandra' },

  { id: 'nano_blood', name: 'Nanobot Blood Swimmer', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_blood_swimmer.js', importName: 'createNanoBloodSwimmer' },
  { id: 'nano_gyro', name: 'MEMS Gyroscope', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/mems_gyroscope.js', importName: 'createMEMSGyroscope' },
  { id: 'nano_weaver', name: 'Carbon Nanotube Weaver', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/carbon_nanotube_weaver.js', importName: 'createCarbonNanotubeWeaver' },
  { id: 'nano_gears', name: 'Micro-gears Assembly', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/micro_gears_assembly.js', importName: 'createMicroGearsAssembly' },
  { id: 'nano_dna_v2', name: 'DNA Origami Motor', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/dna_origami_motor.js', importName: 'createDNAOrigamiMotor' },


  { id: 'siege_treb', name: 'Trebuchet', icon: '&#x2699;&#xFE0F;', category: 'siege_engines', importPath: './machines/siege_trebuchet.js', importName: 'createTrebuchet' },
  { id: 'siege_ballista', name: 'Roman Ballista', icon: '&#x2699;&#xFE0F;', category: 'siege_engines', importPath: './machines/siege_ballista.js', importName: 'createBallista' },
  { id: 'siege_ram', name: 'Battering Ram', icon: '&#x2699;&#xFE0F;', category: 'siege_engines', importPath: './machines/siege_battering_ram.js', importName: 'createBatteringRam' },
  { id: 'siege_tower', name: 'Siege Tower', icon: '&#x2699;&#xFE0F;', category: 'siege_engines', importPath: './machines/siege_tower.js', importName: 'createSiegeTower' },
  { id: 'siege_fire', name: 'Greek Fire Siphon', icon: '&#x2699;&#xFE0F;', category: 'siege_engines', importPath: './machines/siege_greek_fire.js', importName: 'createGreekFireSiphon' },

  { id: 'nuc_pwr', name: 'Pressurized Water Reactor', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_pwr_reactor.js', importName: 'createPWR' },
  { id: 'nuc_tower', name: 'Cooling Tower Draft', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_cooling_tower.js', importName: 'createCoolingTower' },
  { id: 'nuc_rods', name: 'Control Rod Drive', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_control_rod_drive.js', importName: 'createControlRodDrive' },
  { id: 'nuc_steam', name: 'Steam Generator', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_steam_generator.js', importName: 'createSteamGenerator' },
  { id: 'nuc_centri', name: 'Reprocessing Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_reprocessing_centrifuge.js', importName: 'createReprocessingCentrifuge' },

  // --- Batch 49 ---
  { id: 'robo_biped', name: 'Bipedal Mechanism', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_bipedal_mechanism.js', importName: 'createBipedalMechanism' },
  { id: 'robo_arm', name: 'Welding Arm', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_industrial_welding_arm.js', importName: 'createIndustrialWeldingArm' },
  { id: 'robo_face', name: 'Animatronic Face', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_animatronic_facial_rig.js', importName: 'createAnimatronicFacialRig' },
  { id: 'robo_wheel', name: 'Omni-Directional Wheel', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_omni_directional_wheel_drive.js', importName: 'createOmniDirectionalWheelDrive' },
  { id: 'robo_leg', name: 'Quadruped Robot Leg', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_quadruped_robot_leg.js', importName: 'createQuadrupedRobotLeg' },

  { id: 'atmo_radar', name: 'Doppler Radar Dome', icon: '&#x2699;&#xFE0F;', category: 'atmospheric_tech', importPath: './machines/atmospheric_doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'atmo_balloon', name: 'Weather Balloon', icon: '&#x2699;&#xFE0F;', category: 'atmospheric_tech', importPath: './machines/atmospheric_weather_balloon.js', importName: 'createWeatherBalloon' },
  { id: 'atmo_anemo', name: 'Anemometer Array', icon: '&#x2699;&#xFE0F;', category: 'atmospheric_tech', importPath: './machines/atmospheric_anemometer.js', importName: 'createAnemometerArray' },
  { id: 'atmo_seeder', name: 'Cloud Seeding Disperser', icon: '&#x2699;&#xFE0F;', category: 'atmospheric_tech', importPath: './machines/atmospheric_cloud_seeder.js', importName: 'createCloudSeeder' },
  { id: 'atmo_lidar', name: 'Lidar Wind Profiler', icon: '&#x2699;&#xFE0F;', category: 'atmospheric_tech', importPath: './machines/atmospheric_lidar_profiler.js', importName: 'createLidarProfiler' },


  { id: 'hydro_pelton', name: 'Pelton Wheel Turbine', icon: '&#x2699;&#xFE0F;', category: 'hydroelectric', importPath: './machines/hydro_pelton_wheel.js', importName: 'createPeltonWheel' },
  { id: 'hydro_francis', name: 'Francis Turbine', icon: '&#x2699;&#xFE0F;', category: 'hydroelectric', importPath: './machines/hydro_francis_turbine.js', importName: 'createFrancisTurbine' },
  { id: 'hydro_sluice', name: 'Sluice Gate Mechanism', icon: '&#x2699;&#xFE0F;', category: 'hydroelectric', importPath: './machines/hydro_sluice_gate.js', importName: 'createSluiceGate' },
  { id: 'hydro_valve', name: 'Penstock Valve', icon: '&#x2699;&#xFE0F;', category: 'hydroelectric', importPath: './machines/hydro_penstock_valve.js', importName: 'createPenstockValve' },
  { id: 'hydro_kaplan', name: 'Kaplan Turbine', icon: '&#x2699;&#xFE0F;', category: 'hydroelectric', importPath: './machines/hydro_kaplan_turbine.js', importName: 'createKaplanTurbine' },

  { id: 'vin_turing', name: 'Turing Bombe Machine', icon: '&#x2699;&#xFE0F;', category: 'vintage_computing', importPath: './machines/vintage_turing_bombe.js', importName: 'createTuringBombe' },
  { id: 'vin_anti', name: 'Antikythera Mechanism', icon: '&#x2699;&#xFE0F;', category: 'vintage_computing', importPath: './machines/vintage_antikythera_mechanism.js', importName: 'createAntikytheraMechanism' },
  { id: 'vin_core', name: 'Core Memory Matrix', icon: '&#x2699;&#xFE0F;', category: 'vintage_computing', importPath: './machines/vintage_core_memory_matrix.js', importName: 'createCoreMemoryMatrix' },
  { id: 'vin_tube', name: 'Vacuum Tube Logic Gate', icon: '&#x2699;&#xFE0F;', category: 'vintage_computing', importPath: './machines/vintage_vacuum_tube_logic.js', importName: 'createVacuumTubeLogicGate' },
  { id: 'vin_punch', name: 'Punch Card Reader', icon: '&#x2699;&#xFE0F;', category: 'vintage_computing', importPath: './machines/vintage_punch_card_reader.js', importName: 'createPunchCardReader' },

  // --- Batch 48 ---
  { id: 'civil_crane', name: 'Tower Crane', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_tower_crane.js', importName: 'createTowerCrane' },
  { id: 'civil_mixer_v2', name: 'Concrete Mixer Truck', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_concrete_mixer_truck.js', importName: 'createConcreteMixerTruck' },
  { id: 'civil_tbm_v2', name: 'Tunnel Boring Machine', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_tunnel_boring_machine.js', importName: 'createTunnelBoringMachine' },
  { id: 'civil_pile', name: 'Pile Driver', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_pile_driver.js', importName: 'createPileDriver' },
  { id: 'civil_bridge', name: 'Bridge Cable Anchor', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_suspension_bridge_cable_anchor.js', importName: 'createSuspensionBridgeCableAnchor' },

  { id: 'phys_quark', name: 'Quark Triplet', icon: '&#x2699;&#xFE0F;', category: 'subatomic_physics', importPath: './machines/subatomic_quark_triplet.js', importName: 'createQuarkTriplet' },
  { id: 'phys_gluon', name: 'Gluon Field Flux', icon: '&#x2699;&#xFE0F;', category: 'subatomic_physics', importPath: './machines/subatomic_gluon_field.js', importName: 'createGluonField' },
  { id: 'phys_electron', name: 'Electron Orbital Cloud', icon: '&#x2699;&#xFE0F;', category: 'subatomic_physics', importPath: './machines/subatomic_electron_orbital.js', importName: 'createElectronOrbital' },
  { id: 'phys_higgs', name: 'Higgs Boson Field', icon: '&#x2699;&#xFE0F;', category: 'subatomic_physics', importPath: './machines/subatomic_higgs_boson.js', importName: 'createHiggsBosonInteraction' },

  { id: 'bio_hemo', name: 'Hemoglobin Protein', icon: '&#x2699;&#xFE0F;', category: 'macromolecules', importPath: './machines/biology_hemoglobin.js', importName: 'createHemoglobin' },
  { id: 'bio_dna', name: 'DNA Polymerase', icon: '&#x2699;&#xFE0F;', category: 'macromolecules', importPath: './machines/biology_dna_polymerase.js', importName: 'createDNAPolymerase' },
  { id: 'bio_atp', name: 'ATP Synthase Motor', icon: '&#x2699;&#xFE0F;', category: 'macromolecules', importPath: './machines/biology_atp_synthase.js', importName: 'createATPSynthase' },
  { id: 'bio_ribo', name: 'Ribosome Complex', icon: '&#x2699;&#xFE0F;', category: 'macromolecules', importPath: './machines/biology_ribosome.js', importName: 'createRibosome' },
  { id: 'bio_crispr_v2', name: 'CRISPR-Cas9 System', icon: '&#x2699;&#xFE0F;', category: 'macromolecules', importPath: './machines/biology_crispr_cas9.js', importName: 'createCRISPRCas9' },

  { id: 'loco_steam', name: 'Steam Drive Wheel', icon: '&#x2699;&#xFE0F;', category: 'locomotive_tech', importPath: './machines/locomotive_steam_drive_wheel.js', importName: 'createSteamDriveWheel' },
  { id: 'loco_maglev', name: 'Maglev Undercarriage', icon: '&#x2699;&#xFE0F;', category: 'locomotive_tech', importPath: './machines/locomotive_maglev_undercarriage.js', importName: 'createMaglevUndercarriage' },
  { id: 'loco_panto', name: 'Pantograph Assembly', icon: '&#x2699;&#xFE0F;', category: 'locomotive_tech', importPath: './machines/locomotive_pantograph_assembly.js', importName: 'createPantographAssembly' },
  { id: 'loco_switch', name: 'Rail Switch Mechanism', icon: '&#x2699;&#xFE0F;', category: 'locomotive_tech', importPath: './machines/locomotive_rail_switch_mechanism.js', importName: 'createRailSwitchMechanism' },
  { id: 'loco_diesel', name: 'Diesel-Electric Gen', icon: '&#x2699;&#xFE0F;', category: 'locomotive_tech', importPath: './machines/locomotive_diesel_electric_generator.js', importName: 'createDieselElectricGenerator' },

  { id: 'space_cupola', name: 'Cupola Obs Module', icon: '&#x2699;&#xFE0F;', category: 'space_station', importPath: './machines/space_station_cupola.js', importName: 'createCupolaModule' },
  { id: 'space_solar', name: 'Solar Array Truss', icon: '&#x2699;&#xFE0F;', category: 'space_station', importPath: './machines/space_station_solar_array.js', importName: 'createSolarArrayTruss' },
  { id: 'space_dock', name: 'Docking Port Adapter', icon: '&#x2699;&#xFE0F;', category: 'space_station', importPath: './machines/space_station_docking_port.js', importName: 'createDockingPortAdapter' },
  { id: 'space_centrifuge', name: 'Centrifuge Habitat', icon: '&#x2699;&#xFE0F;', category: 'space_station', importPath: './machines/space_station_centrifuge.js', importName: 'createCentrifugeHabitat' },
  { id: 'space_airlock', name: 'Airlock Chamber', icon: '&#x2699;&#xFE0F;', category: 'space_station', importPath: './machines/space_station_airlock.js', importName: 'createAirlockChamber' },

  // --- Batch 47 ---
  { id: 'clock_escape', name: 'Clock Escapement', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_clock_escapement.js', importName: 'createClockEscapement' },
  { id: 'clock_auto', name: 'Drafting Automaton', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_drafting_automaton.js', importName: 'createDraftingAutomaton' },
  { id: 'clock_orrery', name: 'Mechanical Orrery', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_mechanical_orrery.js', importName: 'createMechanicalOrrery' },
  { id: 'clock_metro', name: 'Mechanical Metronome', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_metronome.js', importName: 'createMetronome' },
  { id: 'clock_bird', name: 'Singing Bird Box', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_singing_bird_box.js', importName: 'createSingingBirdBox' },

  { id: 'spy_cylinder', name: 'Cryptographic Cylinder', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_crypto_cylinder.js', importName: 'createCryptographicCylinder' },
  { id: 'spy_enigma', name: 'Enigma Machine', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_enigma.js', importName: 'createEnigmaMachine' },
  { id: 'spy_camera', name: 'Microdot Camera', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_microdot_camera.js', importName: 'createMicrodotCamera' },
  { id: 'spy_umbrella', name: 'Poison Dart Umbrella', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_poison_umbrella.js', importName: 'createPoisonUmbrella' },
  { id: 'spy_wiretap', name: 'Wiretap Listening Device', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_wiretap.js', importName: 'createWiretapDevice' },

  { id: 'sea_bathy', name: 'Bathysphere', icon: '&#x2699;&#xFE0F;', category: 'deep_sea', importPath: './machines/deep_sea_bathysphere.js', importName: 'createBathysphere' },
  { id: 'sea_arm', name: 'ROV Manipulator Arm', icon: '&#x2699;&#xFE0F;', category: 'deep_sea', importPath: './machines/deep_sea_rov_arm.js', importName: 'createROVArm' },
  { id: 'sea_sonar', name: 'Sonar Array', icon: '&#x2699;&#xFE0F;', category: 'deep_sea', importPath: './machines/deep_sea_sonar_array.js', importName: 'createSonarArray' },
  { id: 'sea_sub', name: 'Deep Sea Submersible', icon: '&#x2699;&#xFE0F;', category: 'deep_sea', importPath: './machines/deep_sea_submersible.js', importName: 'createSubmersible' },
  { id: 'sea_thruster', name: 'Underwater Thruster', icon: '&#x2699;&#xFE0F;', category: 'deep_sea', importPath: './machines/deep_sea_thruster.js', importName: 'createUnderwaterThruster' },

  { id: 'da_vinci_screw', name: 'Aerial Screw', icon: '&#x2699;&#xFE0F;', category: 'da_vinci', importPath: './machines/da_vinci_aerial_screw.js', importName: 'createAerialScrew' },
  { id: 'da_vinci_tank', name: 'Armored Tank Gearbox', icon: '&#x2699;&#xFE0F;', category: 'da_vinci', importPath: './machines/da_vinci_armored_tank_gearbox.js', importName: 'createArmoredTankGearbox' },
  { id: 'da_vinci_cannon', name: 'Multi-Barrel Cannon', icon: '&#x2699;&#xFE0F;', category: 'da_vinci', importPath: './machines/da_vinci_multi_barrel_cannon.js', importName: 'createMultiBarrelCannon' },
  { id: 'da_vinci_wings', name: 'Ornithopter Wings', icon: '&#x2699;&#xFE0F;', category: 'da_vinci', importPath: './machines/da_vinci_ornithopter_wings.js', importName: 'createOrnithopterWings' },
  { id: 'da_vinci_boat', name: 'Paddle Boat Mechanism', icon: '&#x2699;&#xFE0F;', category: 'da_vinci', importPath: './machines/da_vinci_paddle_boat_mechanism.js', importName: 'createPaddleBoatMechanism' },

  { id: 'phys_wave', name: 'Gravitational Interferometer', icon: '&#x2699;&#xFE0F;', category: 'advanced_physics', importPath: './machines/physics_gravitational_wave.js', importName: 'createGravitationalWaveInterferometer' },
  { id: 'phys_neutrino', name: 'Neutrino Detector', icon: '&#x2699;&#xFE0F;', category: 'advanced_physics', importPath: './machines/physics_neutrino_detector.js', importName: 'createNeutrinoDetector' },
  { id: 'phys_accel', name: 'Particle Accelerator', icon: '&#x2699;&#xFE0F;', category: 'advanced_physics', importPath: './machines/physics_particle_accelerator.js', importName: 'createParticleAccelerator' },
  { id: 'phys_quantum', name: 'Quantum Entanglement App', icon: '&#x2699;&#xFE0F;', category: 'advanced_physics', importPath: './machines/physics_quantum_entanglement.js', importName: 'createQuantumEntanglement' },
  { id: 'phys_tokamak', name: 'Tokamak Fusion Reactor', icon: '&#x2699;&#xFE0F;', category: 'advanced_physics', importPath: './machines/physics_tokamak.js', importName: 'createTokamak' },

  // --- Batch 46 ---

  { id: 'mars_crane', name: 'Descent Stage Crane', icon: '&#x2699;&#xFE0F;', category: 'mars_rover', importPath: './machines/mars_rover_descent_stage_crane.js', importName: 'createDescentStageCrane' },
  { id: 'mars_rtg', name: 'Multi-Mission RTG', icon: '&#x2699;&#xFE0F;', category: 'mars_rover', importPath: './machines/mars_rover_multi_mission_rtg.js', importName: 'createMultiMissionRTG' },
  { id: 'mars_mast', name: 'Panoramic Camera Mast', icon: '&#x2699;&#xFE0F;', category: 'mars_rover', importPath: './machines/mars_rover_panoramic_camera_mast.js', importName: 'createPanoramicCameraMast' },
  { id: 'mars_bogie', name: 'Rocker-Bogie Suspension', icon: '&#x2699;&#xFE0F;', category: 'mars_rover', importPath: './machines/mars_rover_rocker_bogie.js', importName: 'createRockerBogie' },
  { id: 'mars_drill', name: 'Sample Return Drill', icon: '&#x2699;&#xFE0F;', category: 'mars_rover', importPath: './machines/mars_rover_sample_return_drill.js', importName: 'createSampleReturnDrill' },

  { id: 'geo_pump', name: 'Geothermal Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'ocean_geo_tech', importPath: './machines/ocean_geo_geothermal_heat_pump.js', importName: 'createGeothermalHeatPump' },
  { id: 'geo_otec', name: 'OTEC Plant', icon: '&#x2699;&#xFE0F;', category: 'ocean_geo_tech', importPath: './machines/ocean_geo_otec_plant.js', importName: 'createOtecPlant' },
  { id: 'geo_salinity', name: 'Salinity Gradient', icon: '&#x2699;&#xFE0F;', category: 'ocean_geo_tech', importPath: './machines/ocean_geo_salinity_gradient_generator.js', importName: 'createSalinityGradientGenerator' },
  { id: 'geo_tidal', name: 'Tidal Turbine', icon: '&#x2699;&#xFE0F;', category: 'ocean_geo_tech', importPath: './machines/ocean_geo_tidal_turbine.js', importName: 'createTidalTurbine' },
  { id: 'geo_wave', name: 'Wave Energy Converter', icon: '&#x2699;&#xFE0F;', category: 'ocean_geo_tech', importPath: './machines/ocean_geo_wave_energy_converter.js', importName: 'createWaveEnergyConverter' },

  { id: 'cam_flash', name: 'Flashbulb Synchronizer', icon: '&#x2699;&#xFE0F;', category: 'vintage_cameras', importPath: './machines/vintage_camera_flashbulb.js', importName: 'createFlashbulbSynchronizer' },
  { id: 'cam_instant', name: 'Instant Film Mechanism', icon: '&#x2699;&#xFE0F;', category: 'vintage_cameras', importPath: './machines/vintage_camera_instant.js', importName: 'createInstantFilmMechanism' },
  { id: 'cam_range', name: 'Rangefinder Mechanism', icon: '&#x2699;&#xFE0F;', category: 'vintage_cameras', importPath: './machines/vintage_camera_rangefinder.js', importName: 'createRangefinderMechanism' },
  { id: 'cam_tlr', name: 'Twin-Lens Reflex', icon: '&#x2699;&#xFE0F;', category: 'vintage_cameras', importPath: './machines/vintage_camera_tlr.js', importName: 'createTwinLensReflex' },
  { id: 'cam_view', name: 'Large Format Camera', icon: '&#x2699;&#xFE0F;', category: 'vintage_cameras', importPath: './machines/vintage_camera_view.js', importName: 'createLargeFormatViewCamera' },

  { id: 'audio_mic', name: 'Dynamic Microphone', icon: '&#x2699;&#xFE0F;', category: 'audio_tech', importPath: './machines/audio_tech_dynamic_microphone.js', importName: 'createDynamicMicrophone' },
  { id: 'audio_speaker_v2', name: 'Electrostatic Speaker', icon: '&#x2699;&#xFE0F;', category: 'audio_tech', importPath: './machines/audio_tech_electrostatic_speaker.js', importName: 'createElectrostaticSpeaker' },
  { id: 'audio_coil', name: 'Moving Coil Cartridge', icon: '&#x2699;&#xFE0F;', category: 'audio_tech', importPath: './machines/audio_tech_moving_coil_cartridge.js', importName: 'createMovingCoilCartridge' },
  { id: 'audio_tape', name: 'Reel-to-Reel Tape Deck', icon: '&#x2699;&#xFE0F;', category: 'audio_tech', importPath: './machines/audio_tech_reel_to_reel_tape_deck.js', importName: 'createReelToReelTapeDeck' },
  { id: 'audio_amp', name: 'Vacuum Tube Amplifier', icon: '&#x2699;&#xFE0F;', category: 'audio_tech', importPath: './machines/audio_tech_vacuum_tube_amplifier.js', importName: 'createVacuumTubeAmplifier' },

  // --- Batch 45 ---
  { id: 'theme_bumper', name: 'Bumper Car', icon: '&#x2699;&#xFE0F;', category: 'theme_park', importPath: './machines/theme_park_bumper_car.js', importName: 'createBumperCar' },
  { id: 'theme_drop', name: 'Drop Tower', icon: '&#x2699;&#xFE0F;', category: 'theme_park', importPath: './machines/theme_park_drop_tower.js', importName: 'createDropTower' },
  { id: 'theme_pendulum', name: 'Giant Pendulum', icon: '&#x2699;&#xFE0F;', category: 'theme_park', importPath: './machines/theme_park_giant_pendulum.js', importName: 'createGiantPendulumRide' },
  { id: 'theme_scrambler', name: 'Scrambler Ride', icon: '&#x2699;&#xFE0F;', category: 'theme_park', importPath: './machines/theme_park_scrambler.js', importName: 'createScramblerRide' },
  { id: 'theme_topspin', name: 'Top Spin Ride', icon: '&#x2699;&#xFE0F;', category: 'theme_park', importPath: './machines/theme_park_top_spin.js', importName: 'createTopSpinRide' },

  { id: 'textile_gin', name: 'Cotton Gin', icon: '&#x2699;&#xFE0F;', category: 'textile_tech', importPath: './machines/textile_cotton_gin.js', importName: 'createCottonGin' },
  { id: 'textile_knit', name: 'Knitting Machine', icon: '&#x2699;&#xFE0F;', category: 'textile_tech', importPath: './machines/textile_knitting_machine.js', importName: 'createKnittingMachine' },
  { id: 'textile_loom', name: 'Power Loom', icon: '&#x2699;&#xFE0F;', category: 'textile_tech', importPath: './machines/textile_power_loom.js', importName: 'createPowerLoom' },
  { id: 'textile_sewing', name: 'Industrial Sewing', icon: '&#x2699;&#xFE0F;', category: 'textile_tech', importPath: './machines/textile_sewing_machine.js', importName: 'createSewingMachine' },
  { id: 'textile_spinning', name: 'Spinning Wheel', icon: '&#x2699;&#xFE0F;', category: 'textile_tech', importPath: './machines/textile_spinning_wheel.js', importName: 'createSpinningWheel' },

  { id: 'plumb_cent', name: 'Centrifugal Pump', icon: '&#x2699;&#xFE0F;', category: 'plumbing_tech', importPath: './machines/plumbing_centrifugal_pump.js', importName: 'createCentrifugalPump' },
  { id: 'plumb_piston', name: 'Double-Acting Piston', icon: '&#x2699;&#xFE0F;', category: 'plumbing_tech', importPath: './machines/plumbing_double_acting_piston_pump.js', importName: 'createDoubleActingPistonPump' },
  { id: 'plumb_gate', name: 'Gate Valve', icon: '&#x2699;&#xFE0F;', category: 'plumbing_tech', importPath: './machines/plumbing_gate_valve.js', importName: 'createGateValve' },
  { id: 'plumb_meter', name: 'Mechanical Water Meter', icon: '&#x2699;&#xFE0F;', category: 'plumbing_tech', importPath: './machines/plumbing_mechanical_water_meter.js', importName: 'createMechanicalWaterMeter' },
  { id: 'plumb_relief', name: 'Pressure Relief Valve', icon: '&#x2699;&#xFE0F;', category: 'plumbing_tech', importPath: './machines/plumbing_pressure_relief_valve.js', importName: 'createPressureReliefValve' },

  { id: 'wood_band', name: 'Band Saw', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_band_saw.js', importName: 'createBandSaw' },
  { id: 'wood_drill', name: 'Floor Drill Press', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_floor_drill_press.js', importName: 'createFloorDrillPress' },
  { id: 'wood_table', name: 'Table Saw', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_table_saw.js', importName: 'createTableSaw' },
  { id: 'wood_planer', name: 'Thickness Planer', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_thickness_planer.js', importName: 'createThicknessPlaner' },
  { id: 'wood_lathe', name: 'Wood Lathe', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_wood_lathe.js', importName: 'createWoodLathe' },

  { id: 'heli_main', name: 'Main Rotor Hub', icon: '&#x2699;&#xFE0F;', category: 'helicopter_tech', importPath: './machines/helicopter_main_rotor.js', importName: 'createMainRotor' },
  { id: 'heli_skid', name: 'Landing Skid Dampener', icon: '&#x2699;&#xFE0F;', category: 'helicopter_tech', importPath: './machines/helicopter_skid_dampener.js', importName: 'createSkidDampener' },
  { id: 'heli_swash', name: 'Helicopter Swashplate', icon: '&#x2699;&#xFE0F;', category: 'helicopter_tech', importPath: './machines/helicopter_swashplate.js', importName: 'createSwashplate' },
  { id: 'heli_tail', name: 'Tail Rotor Assembly', icon: '&#x2699;&#xFE0F;', category: 'helicopter_tech', importPath: './machines/helicopter_tail_rotor.js', importName: 'createTailRotor' },
  { id: 'heli_engine', name: 'Turboshaft Engine', icon: '&#x2699;&#xFE0F;', category: 'helicopter_tech', importPath: './machines/helicopter_turboshaft_engine.js', importName: 'createTurboshaftEngine' },

  // --- Batch 44 ---
  { id: 'casino_shuffler', name: 'Card Shuffler', icon: '&#x2699;&#xFE0F;', category: 'casino_equipment', importPath: './machines/casino_card_shuffler.js', importName: 'createCardShuffler' },
  { id: 'casino_sorter', name: 'Chip Sorter', icon: '&#x2699;&#xFE0F;', category: 'casino_equipment', importPath: './machines/casino_chip_sorter.js', importName: 'createChipSorter' },
  { id: 'casino_dice', name: 'Dice Tumbler', icon: '&#x2699;&#xFE0F;', category: 'casino_equipment', importPath: './machines/casino_dice_tumbler.js', importName: 'createDiceTumbler' },
  { id: 'casino_roulette', name: 'Roulette Wheel', icon: '&#x2699;&#xFE0F;', category: 'casino_equipment', importPath: './machines/casino_roulette_wheel.js', importName: 'createRouletteWheel' },
  { id: 'casino_slot', name: 'Slot Machine', icon: '&#x2699;&#xFE0F;', category: 'casino_equipment', importPath: './machines/casino_slot_machine.js', importName: 'createSlotMachine' },

  { id: 'gym_weight', name: 'Cable Weight Stack', icon: '&#x2699;&#xFE0F;', category: 'gym_equipment', importPath: './machines/gym_cable_weight_stack.js', importName: 'createCableWeightStack' },
  { id: 'gym_elliptical', name: 'Elliptical Trainer', icon: '&#x2699;&#xFE0F;', category: 'gym_equipment', importPath: './machines/gym_elliptical_trainer.js', importName: 'createEllipticalTrainer' },
  { id: 'gym_rowing', name: 'Rowing Machine', icon: '&#x2699;&#xFE0F;', category: 'gym_equipment', importPath: './machines/gym_magnetic_rowing_machine.js', importName: 'createRowingMachine' },
  { id: 'gym_treadmill', name: 'Treadmill', icon: '&#x2699;&#xFE0F;', category: 'gym_equipment', importPath: './machines/gym_motorized_treadmill.js', importName: 'createTreadmill' },
  { id: 'gym_spin', name: 'Spin Bike', icon: '&#x2699;&#xFE0F;', category: 'gym_equipment', importPath: './machines/gym_spin_bike.js', importName: 'createSpinBike' },

  { id: 'print_braille', name: 'Braille Embosser', icon: '&#x2699;&#xFE0F;', category: 'printing_tech', importPath: './machines/printing_braille_embosser.js', importName: 'createBrailleEmbosser' },
  { id: 'print_3d', name: 'FDM 3D Printer', icon: '&#x2699;&#xFE0F;', category: 'printing_tech', importPath: './machines/printing_fdm_3d_printer.js', importName: 'createFDM3DPrinter' },
  { id: 'print_laser', name: 'Laser Printer', icon: '&#x2699;&#xFE0F;', category: 'printing_tech', importPath: './machines/printing_laser_printer.js', importName: 'createLaserPrinter' },
  { id: 'print_offset', name: 'Offset Press', icon: '&#x2699;&#xFE0F;', category: 'printing_tech', importPath: './machines/printing_offset_press.js', importName: 'createOffsetPress' },
  { id: 'print_typewriter', name: 'Vintage Typewriter', icon: '&#x2699;&#xFE0F;', category: 'printing_tech', importPath: './machines/printing_vintage_typewriter.js', importName: 'createVintageTypewriter' },

  { id: 'kitchen_dishwasher', name: 'Dishwasher', icon: '&#x2699;&#xFE0F;', category: 'kitchen_appliances', importPath: './machines/kitchen_dishwasher.js', importName: 'createDishwasher' },
  { id: 'kitchen_espresso', name: 'Espresso Machine', icon: '&#x2699;&#xFE0F;', category: 'kitchen_appliances', importPath: './machines/kitchen_espresso_machine.js', importName: 'createEspressoMachine' },
  { id: 'kitchen_microwave', name: 'Microwave Oven', icon: '&#x2699;&#xFE0F;', category: 'kitchen_appliances', importPath: './machines/kitchen_microwave_oven.js', importName: 'createMicrowaveOven' },
  { id: 'kitchen_fridge', name: 'Refrigerator Compressor', icon: '&#x2699;&#xFE0F;', category: 'kitchen_appliances', importPath: './machines/kitchen_refrigerator_compressor.js', importName: 'createRefrigeratorCompressor' },
  { id: 'kitchen_mixer', name: 'Planetary Stand Mixer', icon: '&#x2699;&#xFE0F;', category: 'kitchen_appliances', importPath: './machines/kitchen_stand_mixer.js', importName: 'createStandMixer' },

  { id: 'met_baro', name: 'Mechanical Barograph', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_barograph.js', importName: 'createBarograph' },
  { id: 'met_anemo', name: 'Cup Anemometer', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_cup_anemometer.js', importName: 'createCupAnemometer' },
  { id: 'met_radar', name: 'Doppler Weather Radar', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'met_radio', name: 'Weather Balloon Radiosonde', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_radiosonde.js', importName: 'createRadiosonde' },
  { id: 'met_seismo', name: 'Drum Seismograph', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_seismograph.js', importName: 'createSeismograph' },

  // --- Batch 43 ---
  { id: 'music_drum', name: 'Acoustic Drum Kit', icon: '&#x2699;&#xFE0F;', category: 'musical_instruments', importPath: './machines/music_acoustic_drum_kit.js', importName: 'createAcousticDrumKit' },
  { id: 'music_guitar', name: 'Electric Guitar', icon: '&#x2699;&#xFE0F;', category: 'musical_instruments', importPath: './machines/music_electric_guitar.js', importName: 'createElectricGuitar' },
  { id: 'music_piano', name: 'Grand Piano', icon: '&#x2699;&#xFE0F;', category: 'musical_instruments', importPath: './machines/music_grand_piano.js', importName: 'createGrandPiano' },
  { id: 'music_moog', name: 'Moog Synthesizer', icon: '&#x2699;&#xFE0F;', category: 'musical_instruments', importPath: './machines/music_moog_synthesizer.js', importName: 'createMoogSynthesizer' },
  { id: 'music_organ', name: 'Pipe Organ', icon: '&#x2699;&#xFE0F;', category: 'musical_instruments', importPath: './machines/music_pipe_organ.js', importName: 'createPipeOrgan' },

  { id: 'optics_holo', name: 'Holographic Projector', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_holographic_projector.js', importName: 'createHolographicProjector' },
  { id: 'optics_laser', name: 'Laser Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_laser_interferometer.js', importName: 'createLaserInterferometer' },
  { id: 'optics_telescope', name: 'Observatory Telescope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_observatory_telescope.js', importName: 'createObservatoryTelescope' },
  { id: 'optics_spec', name: 'Optical Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_optical_spectrometer.js', importName: 'createOpticalSpectrometer' },
  { id: 'optics_sem', name: 'Scanning Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_scanning_electron_microscope.js', importName: 'createScanningElectronMicroscope' },

  { id: 'auto_brake', name: 'Disc Brake System', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_disc_brake.js', importName: 'createDiscBrake' },
  { id: 'auto_trans', name: 'Manual Transmission', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_manual_transmission.js', importName: 'createManualTransmission' },
  { id: 'auto_diff', name: 'Open Differential Gear', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_open_differential.js', importName: 'createOpenDifferential' },
  { id: 'auto_rack', name: 'Rack and Pinion', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_rack_and_pinion.js', importName: 'createRackAndPinion' },
  { id: 'auto_suspension', name: 'Suspension Strut', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_suspension_strut.js', importName: 'createSuspensionStrut' },

  { id: 'cinema_projector', name: 'Film Projector', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/cinema_film_projector.js', importName: 'createFilmProjector' },
  { id: 'cinema_imax', name: 'IMAX Camera', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/cinema_imax_camera.js', importName: 'createImaxCamera' },
  { id: 'cinema_robot', name: 'Motion Control Robot', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/cinema_motion_control_robot.js', importName: 'createMotionControlRobot' },
  { id: 'cinema_steadicam', name: 'Steadicam Rig', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/cinema_steadicam_rig.js', importName: 'createSteadicamRig' },
  { id: 'cinema_truss', name: 'Studio Lighting Truss', icon: '&#x2699;&#xFE0F;', category: 'cinematography', importPath: './machines/cinema_studio_lighting.js', importName: 'createStudioLightingTruss' },

  { id: 'mining_bucket', name: 'Bucket Wheel Excavator', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_bucket_wheel.js', importName: 'createBucketWheel' },
  { id: 'mining_continuous', name: 'Continuous Miner', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_continuous_miner.js', importName: 'createContinuousMiner' },
  { id: 'mining_dragline', name: 'Dragline Excavator', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_dragline_excavator.js', importName: 'createDragline' },
  { id: 'mining_jaw', name: 'Jaw Rock Crusher', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_jaw_rock_crusher.js', importName: 'createJawRockCrusher' },
  { id: 'mining_elevator', name: 'Mine Shaft Elevator', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_mine_shaft_elevator.js', importName: 'createMineShaftElevator' },

  // --- Batch 42 ---
  { id: 'amus_carousel', name: 'Grand Carousel', icon: '&#x2699;&#xFE0F;', category: 'amusement_rides', importPath: './machines/amusement_carousel.js', importName: 'createGrandCarousel' },
  { id: 'amus_drop', name: 'Drop Tower', icon: '&#x2699;&#xFE0F;', category: 'amusement_rides', importPath: './machines/amusement_drop_tower.js', importName: 'createDropTower' },
  { id: 'amus_ferris', name: 'Ferris Wheel', icon: '&#x2699;&#xFE0F;', category: 'amusement_rides', importPath: './machines/amusement_ferris_wheel.js', importName: 'createFerrisWheel' },
  { id: 'amus_pendulum', name: 'Pendulum Swing', icon: '&#x2699;&#xFE0F;', category: 'amusement_rides', importPath: './machines/amusement_pendulum.js', importName: 'createPendulumSwing' },
  { id: 'amus_coaster', name: 'Rollercoaster', icon: '&#x2699;&#xFE0F;', category: 'amusement_rides', importPath: './machines/amusement_rollercoaster.js', importName: 'createRollercoaster' },

  { id: 'agri_seeder', name: 'Robotic Seeder', icon: '&#x2699;&#xFE0F;', category: 'agricultural_tech', importPath: './machines/agricultural_automated_robotic_seeder.js', importName: 'createAutomatedRoboticSeeder' },
  { id: 'agri_irrigation', name: 'Pivot Irrigation', icon: '&#x2699;&#xFE0F;', category: 'agricultural_tech', importPath: './machines/agricultural_center_pivot_irrigation_system.js', importName: 'createCenterPivotIrrigationSystem' },
  { id: 'agri_harvester', name: 'Combine Harvester', icon: '&#x2699;&#xFE0F;', category: 'agricultural_tech', importPath: './machines/agricultural_combine_harvester.js', importName: 'createCombineHarvester' },
  { id: 'agri_milker', name: 'Robotic Milking Machine', icon: '&#x2699;&#xFE0F;', category: 'agricultural_tech', importPath: './machines/agricultural_robotic_milking_machine.js', importName: 'createRoboticMilkingMachine' },
  { id: 'agri_tractor', name: 'Tractor', icon: '&#x2699;&#xFE0F;', category: 'agricultural_tech', importPath: './machines/agricultural_tractor.js', importName: 'createAgriculturalTractor' },

  { id: 'marine_container', name: 'Container Ship', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_container_ship.js', importName: 'createContainerShip' },
  { id: 'marine_hover', name: 'Hovercraft', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_hovercraft.js', importName: 'createHovercraft' },
  { id: 'marine_hydro', name: 'Hydrofoil Ferry', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_hydrofoil.js', importName: 'createHydrofoil' },
  { id: 'marine_sub', name: 'Nuclear Submarine', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_submarine.js', importName: 'createSubmarine' },
  { id: 'marine_rov', name: 'Deep Sea ROV', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_submersible.js', importName: 'createSubmersible' },

  { id: 'hist_ballista', name: 'Roman Ballista', icon: '&#x2699;&#xFE0F;', category: 'historical_warfare', importPath: './machines/historical_ballista.js', importName: 'createBallista' },
  { id: 'hist_ram', name: 'Battering Ram', icon: '&#x2699;&#xFE0F;', category: 'historical_warfare', importPath: './machines/historical_battering_ram.js', importName: 'createBatteringRam' },
  { id: 'hist_catapult', name: 'Catapult', icon: '&#x2699;&#xFE0F;', category: 'historical_warfare', importPath: './machines/historical_catapult.js', importName: 'createCatapult' },
  { id: 'hist_tower', name: 'Siege Tower', icon: '&#x2699;&#xFE0F;', category: 'historical_warfare', importPath: './machines/historical_siege_tower.js', importName: 'createSiegeTower' },
  { id: 'hist_trebuchet', name: 'Trebuchet', icon: '&#x2699;&#xFE0F;', category: 'historical_warfare', importPath: './machines/historical_trebuchet.js', importName: 'createTrebuchet' },

  { id: 'hor_astrolabe', name: 'Brass Astrolabe', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_astrolabe.js', importName: 'createAstrolabe' },
  { id: 'hor_cuckoo', name: 'Cuckoo Clock', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_cuckoo_clock.js', importName: 'createCuckooClock' },
  { id: 'hor_grand', name: 'Grandfather Clock', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_grandfather_clock.js', importName: 'createGrandfatherClock' },
  { id: 'hor_chrono', name: 'Marine Chronometer', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_marine_chronometer.js', importName: 'createMarineChronometer' },
  { id: 'hor_tourbillon', name: 'Tourbillon Escapement', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_tourbillon.js', importName: 'createTourbillon' },

  // --- Batch 41 ---
  { id: 'pros_arm', name: 'Bionic Arm', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_bionic_arm.js', importName: 'createBionicArm' },
  { id: 'pros_leg', name: 'Exoskeleton Leg', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_exoskeleton_leg.js', importName: 'createExoskeletonLeg' },
  { id: 'pros_spine', name: 'Neural Bypass Spine', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_neural_bypass_spine.js', importName: 'createNeuralBypassSpine' },
  { id: 'pros_eye', name: 'Retinal Implant', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_retinal_implant.js', importName: 'createRetinalImplant' },
  { id: 'pros_ear', name: 'Cochlear Implant', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_cochlear_implant.js', importName: 'createCochlearImplant' },

  { id: 'mega_elevator', name: 'Space Elevator', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_space_elevator.js', importName: 'createSpaceElevator' },
  { id: 'mega_dyson', name: 'Dyson Swarm Node', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_dyson_swarm_node.js', importName: 'createDysonSwarmNode' },
  { id: 'mega_oneill', name: 'ONeill Cylinder', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_oneill_cylinder.js', importName: 'createONeillCylinder' },
  { id: 'mega_torus', name: 'Stanford Torus', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_stanford_torus.js', importName: 'createStanfordTorus' },
  { id: 'mega_dock', name: 'Starship Docking Bay', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_starship_docking_bay.js', importName: 'createStarshipDockingBay' },

  { id: 'quant_fridge', name: 'Dilution Refrigerator', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/quantum_dilution_fridge.js', importName: 'createDilutionFridge' },
  { id: 'quant_coaxial', name: 'Microwave Coaxial Line', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/microwave_coaxial_line.js', importName: 'createMicrowaveCoaxialLine' },
  { id: 'quant_jj', name: 'Josephson Junction', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/josephson_junction.js', importName: 'createJosephsonJunction' },
  { id: 'quant_squid', name: 'SQUID Sensor', icon: '&#x2699;&#xFE0F;', category: 'quantum_hardware', importPath: './machines/squid_sensor.js', importName: 'createSQUID' },

  { id: 'net_cell', name: '5G Cell Tower', icon: '&#x2699;&#xFE0F;', category: 'network_infrastructure', importPath: './machines/network_5g_cell_tower.js', importName: 'createCellTower' },
  { id: 'net_fiber', name: 'Subsea Fiber Cable', icon: '&#x2699;&#xFE0F;', category: 'network_infrastructure', importPath: './machines/network_subsea_fiber_cable.js', importName: 'createSubseaFiberCable' },
  { id: 'net_sat', name: 'Satellite Dish Array', icon: '&#x2699;&#xFE0F;', category: 'network_infrastructure', importPath: './machines/network_satellite_dish_array.js', importName: 'createSatelliteDishArray' },
  { id: 'net_server', name: 'Datacenter Server Rack', icon: '&#x2699;&#xFE0F;', category: 'network_infrastructure', importPath: './machines/network_datacenter_server_rack.js', importName: 'createDatacenterServerRack' },
  { id: 'net_switch', name: 'High-Speed Network Switch', icon: '&#x2699;&#xFE0F;', category: 'network_infrastructure', importPath: './machines/network_high_speed_switch.js', importName: 'createHighSpeedNetworkSwitch' },

  { id: 'audio_speaker_v3', name: 'Dynamic Loudspeaker', icon: '&#x2699;&#xFE0F;', category: 'audio_equipment', importPath: './machines/audio_loudspeaker.js', importName: 'createLoudspeaker' },
  { id: 'audio_vinyl', name: 'Vinyl Turntable', icon: '&#x2699;&#xFE0F;', category: 'audio_equipment', importPath: './machines/audio_turntable.js', importName: 'createTurntable' },
  { id: 'audio_mixer', name: 'Audio Mixing Console', icon: '&#x2699;&#xFE0F;', category: 'audio_equipment', importPath: './machines/audio_mixer.js', importName: 'createMixer' },

  // --- Batch 40 ---
  { id: 'pwr_nuke', name: 'Nuclear Power Plant', icon: '&#x2699;&#xFE0F;', category: 'power_generation', importPath: './machines/power_generation_nuclear_plant.js', importName: 'createNuclearPlant' },
  { id: 'pwr_coal', name: 'Coal Power Plant', icon: '&#x2699;&#xFE0F;', category: 'power_generation', importPath: './machines/power_generation_coal_plant.js', importName: 'createCoalPlant' },
  { id: 'pwr_hydro', name: 'Hydroelectric Dam', icon: '&#x2699;&#xFE0F;', category: 'power_generation', importPath: './machines/power_generation_hydroelectric_dam.js', importName: 'createHydroelectricDam' },
  { id: 'pwr_wind', name: 'Wind Turbine', icon: '&#x2699;&#xFE0F;', category: 'power_generation', importPath: './machines/power_generation_wind_turbine.js', importName: 'createWindTurbine' },
  { id: 'pwr_geo', name: 'Geothermal Plant', icon: '&#x2699;&#xFE0F;', category: 'power_generation', importPath: './machines/power_generation_geothermal_plant.js', importName: 'createGeothermalPlant' },

  { id: 'mech_hex', name: 'Hexapod Robot', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_hexapod.js', importName: 'createHexapod' },
  { id: 'mech_seg', name: 'Self-Balancing Segway', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_segway.js', importName: 'createSegway' },
  { id: 'mech_quad', name: 'Quadcopter Drone', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_quadcopter.js', importName: 'createQuadcopter' },
  { id: 'mech_hand', name: 'Robotic Hand', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_robotic_hand.js', importName: 'createRoboticHand' },
  { id: 'mech_stewart', name: 'Stewart Platform', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_stewart_platform.js', importName: 'createStewartPlatform' },

  { id: 'heavy_exc', name: 'Excavator', icon: '&#x2699;&#xFE0F;', category: 'heavy_machinery', importPath: './machines/heavy_machinery_excavator.js', importName: 'createExcavator' },
  { id: 'heavy_bull', name: 'Bulldozer', icon: '&#x2699;&#xFE0F;', category: 'heavy_machinery', importPath: './machines/heavy_machinery_bulldozer.js', importName: 'createBulldozer' },
  { id: 'heavy_crane', name: 'Tower Crane', icon: '&#x2699;&#xFE0F;', category: 'heavy_machinery', importPath: './machines/heavy_machinery_tower_crane.js', importName: 'createTowerCrane' },
  { id: 'heavy_tbm', name: 'Tunnel Boring Machine', icon: '&#x2699;&#xFE0F;', category: 'heavy_machinery', importPath: './machines/heavy_machinery_tbm.js', importName: 'createTBM' },
  { id: 'heavy_dump', name: 'Dump Truck', icon: '&#x2699;&#xFE0F;', category: 'heavy_machinery', importPath: './machines/heavy_machinery_dump_truck.js', importName: 'createDumpTruck' },

  { id: 'hvac_ac', name: 'Split Air Conditioner', icon: '&#x2699;&#xFE0F;', category: 'hvac_systems', importPath: './machines/hvac_split_air_conditioner.js', importName: 'createAirConditioner' },
  { id: 'hvac_heat', name: 'Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'hvac_systems', importPath: './machines/hvac_heat_pump.js', importName: 'createHeatPump' },
  { id: 'hvac_ref', name: 'Refrigeration Cycle', icon: '&#x2699;&#xFE0F;', category: 'hvac_systems', importPath: './machines/hvac_refrigeration_cycle.js', importName: 'createRefrigerationCycle' },
  { id: 'hvac_tower', name: 'Cooling Tower', icon: '&#x2699;&#xFE0F;', category: 'hvac_systems', importPath: './machines/hvac_cooling_tower.js', importName: 'createCoolingTower' },
  { id: 'hvac_chill', name: 'Industrial Chiller', icon: '&#x2699;&#xFE0F;', category: 'hvac_systems', importPath: './machines/hvac_industrial_chiller.js', importName: 'createIndustrialChiller' },

  { id: 'fluid_press', name: 'Hydraulic Press', icon: '&#x2699;&#xFE0F;', category: 'fluid_power', importPath: './machines/fluid_power_hydraulic_press.js', importName: 'createHydraulicPress' },
  { id: 'fluid_pneumatic', name: 'Pneumatic Cylinder', icon: '&#x2699;&#xFE0F;', category: 'fluid_power', importPath: './machines/fluid_power_pneumatic_cylinder.js', importName: 'createPneumaticCylinder' },
  { id: 'fluid_gear', name: 'Hydraulic Gear Pump', icon: '&#x2699;&#xFE0F;', category: 'fluid_power', importPath: './machines/fluid_power_hydraulic_gear_pump.js', importName: 'createHydraulicGearPump' },
  { id: 'fluid_acc', name: 'Hydraulic Accumulator', icon: '&#x2699;&#xFE0F;', category: 'fluid_power', importPath: './machines/fluid_power_hydraulic_accumulator.js', importName: 'createHydraulicAccumulator' },
  { id: 'fluid_servo', name: 'Servo Valve', icon: '&#x2699;&#xFE0F;', category: 'fluid_power', importPath: './machines/fluid_power_servo_valve.js', importName: 'createServoValve' },

  // --- Batch 39 ---
  { id: 'astro_oscil', name: 'Stellar Oscillator', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_stellar_oscillator.js', importName: 'createStellarOscillator' },
  { id: 'astro_pulse', name: 'Pulsation Modes', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_pulsation_modes.js', importName: 'createPulsationModes' },
  { id: 'astro_core', name: 'Core Resonance', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_core_resonance.js', importName: 'createCoreResonance' },
  { id: 'astro_acoustic', name: 'Acoustic Waves', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_acoustic_waves.js', importName: 'createAcousticWaves' },
  { id: 'astro_doppler', name: 'Doppler Imager', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_doppler_imager.js', importName: 'createDopplerImager' },

  { id: 'exo_xeno', name: 'Xenobot', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_xenobot.js', importName: 'createXenobot' },
  { id: 'exo_spore', name: 'Panspermia Spore', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_panspermia_spore.js', importName: 'createPanspermiaSpore' },
  { id: 'exo_silicon', name: 'Silicon Lifeform', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_silicon_lifeform.js', importName: 'createSiliconLifeform' },
  { id: 'exo_bio', name: 'Biosignature Analyzer', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_biosignature_analyzer.js', importName: 'createBiosignatureAnalyzer' },
  { id: 'exo_flora', name: 'Alien Flora', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_alien_flora.js', importName: 'createAlienFlora' },

  { id: 'mhd_gen', name: 'MHD Generator', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_generator.js', importName: 'createMHDGenerator' },
  { id: 'mhd_tokamak', name: 'Tokamak Reactor', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_tokamak.js', importName: 'createTokamakReactor' },
  { id: 'mhd_thrust', name: 'Plasma Thruster', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_plasma_thruster.js', importName: 'createPlasmaThruster' },
  { id: 'mhd_pump', name: 'MHD Pump', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_pump.js', importName: 'createMHDPump' },
  { id: 'mhd_stellarator', name: 'Stellarator', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_stellarator.js', importName: 'createStellarator' },

  { id: 'stel_binary', name: 'Binary Star System', icon: '&#x2699;&#xFE0F;', category: 'stellar_kinematics', importPath: './machines/stellar_kinematics_binary_system.js', importName: 'createBinaryStarSystem' },
  { id: 'stel_precess', name: 'Orbital Precession', icon: '&#x2699;&#xFE0F;', category: 'stellar_kinematics', importPath: './machines/stellar_kinematics_orbital_precession.js', importName: 'createOrbitalPrecession' },
  { id: 'stel_galact', name: 'Galactic Rotation', icon: '&#x2699;&#xFE0F;', category: 'stellar_kinematics', importPath: './machines/stellar_kinematics_galactic_rotation.js', importName: 'createGalacticRotation' },
  { id: 'stel_kepler', name: 'Keplerian Orbit', icon: '&#x2699;&#xFE0F;', category: 'stellar_kinematics', importPath: './machines/stellar_kinematics_keplerian_orbit.js', importName: 'createKeplerianOrbit' },
  { id: 'stel_accretion', name: 'Accretion Disk', icon: '&#x2699;&#xFE0F;', category: 'stellar_kinematics', importPath: './machines/stellar_kinematics_accretion_disk.js', importName: 'createAccretionDisk' },

  { id: 'qcd_qgp', name: 'QGP Expansion', icon: '&#x2699;&#xFE0F;', category: 'quantum_chromodynamics', importPath: './machines/quantum_chromodynamics_qgp_expansion.js', importName: 'createQGPExpansion' },
  { id: 'qcd_flux', name: 'Flux Tube', icon: '&#x2699;&#xFE0F;', category: 'quantum_chromodynamics', importPath: './machines/quantum_chromodynamics_flux_tube.js', importName: 'createFluxTube' },
  { id: 'qcd_proton', name: 'Proton Structure', icon: '&#x2699;&#xFE0F;', category: 'quantum_chromodynamics', importPath: './machines/quantum_chromodynamics_proton_structure.js', importName: 'createProtonStructure' },
  { id: 'qcd_gluon', name: 'Gluon Vertex', icon: '&#x2699;&#xFE0F;', category: 'quantum_chromodynamics', importPath: './machines/quantum_chromodynamics_gluon_vertex.js', importName: 'createGluonVertex' },
  { id: 'qcd_asymptotic', name: 'Asymptotic Freedom', icon: '&#x2699;&#xFE0F;', category: 'quantum_chromodynamics', importPath: './machines/quantum_chromodynamics_asymptotic_freedom.js', importName: 'createAsymptoticFreedom' },

  // --- Batch 38 ---
  { id: 'neu_oscil', name: 'Oscillation Chamber', icon: '&#x2699;&#xFE0F;', category: 'neutrino_physics', importPath: './machines/neutrino_physics_oscillation_chamber.js', importName: 'createOscillationChamber' },
  { id: 'neu_cherenkov', name: 'Cherenkov Detector', icon: '&#x2699;&#xFE0F;', category: 'neutrino_physics', importPath: './machines/neutrino_physics_cherenkov_detector.js', importName: 'createCherenkovDetector' },
  { id: 'neu_reactor', name: 'Antineutrino Reactor', icon: '&#x2699;&#xFE0F;', category: 'neutrino_physics', importPath: './machines/neutrino_physics_antineutrino_reactor.js', importName: 'createAntineutrinoReactor' },
  { id: 'neu_trap', name: 'Sterile Neutrino Trap', icon: '&#x2699;&#xFE0F;', category: 'neutrino_physics', importPath: './machines/neutrino_physics_sterile_neutrino_trap.js', importName: 'createSterileNeutrinoTrap' },
  { id: 'neu_burst', name: 'Supernova Burst', icon: '&#x2699;&#xFE0F;', category: 'neutrino_physics', importPath: './machines/neutrino_physics_supernova_burst.js', importName: 'createSupernovaNeutrinoBurst' },

  { id: 'epi_methyl', name: 'DNA Methylation', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_dna_methylation.js', importName: 'createDNAMethylation' },
  { id: 'epi_histone', name: 'Histone Modification', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_histone_modification.js', importName: 'createHistoneModification' },
  { id: 'epi_chromatin', name: 'Chromatin Remodeling', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_chromatin_remodeling.js', importName: 'createChromatinRemodeling' },
  { id: 'epi_rna', name: 'RNA Interference', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_rna_interference.js', importName: 'createRNAInterference' },
  { id: 'epi_nucleosome', name: 'Nucleosome Sliding', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_nucleosome_sliding.js', importName: 'createNucleosomeSliding' },

  { id: 'geo_plate', name: 'Tectonic Plate Boundary', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_tectonic_plate_boundary.js', importName: 'createTectonicPlateBoundary' },
  { id: 'geo_fluvial', name: 'Fluvial Erosion', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_fluvial_erosion_system.js', importName: 'createFluvialErosionSystem' },
  { id: 'geo_glacial', name: 'Glacial Retreat', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_glacial_retreat_model.js', importName: 'createGlacialRetreatModel' },
  { id: 'geo_coastal', name: 'Coastal Erosion', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_coastal_erosion_dynamics.js', importName: 'createCoastalErosionDynamics' },
  { id: 'geo_aeolian', name: 'Aeolian Dune Migration', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_aeolian_dune_migration.js', importName: 'createAeolianDuneMigration' },

  { id: 'opto_implant', name: 'Neural Implant', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_neural_implant.js', importName: 'createNeuralImplant' },
  { id: 'opto_cannula', name: 'Fiber Optic Cannula', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_fiber_optic_cannula.js', importName: 'createFiberOpticCannula' },
  { id: 'opto_opsin', name: 'Opsin Protein', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_opsin_protein.js', importName: 'createOpsinProtein' },
  { id: 'opto_array', name: 'Light Stimulation Array', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_light_stimulation_array.js', importName: 'createLightStimulationArray' },
  { id: 'opto_patch', name: 'Patch Clamp Fluorometer', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_patch_clamp_fluorometer.js', importName: 'createPatchClampFluorometer' },

  { id: 'cosmo_isotope', name: 'Isotope Analyzer', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_isotope_analyzer.js', importName: 'createIsotopeAnalyzer' },
  { id: 'cosmo_nebula', name: 'Nebula Simulator', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_nebula_simulator.js', importName: 'createNebulaSimulator' },
  { id: 'cosmo_sublimator', name: 'Cometary Sublimator', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_cometary_sublimator.js', importName: 'createCometarySublimator' },
  { id: 'cosmo_ion', name: 'Presolar Ion Probe', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_ion_probe.js', importName: 'createIonProbe' },
  { id: 'cosmo_furnace', name: 'Chondrule Furnace', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_chondrule_furnace.js', importName: 'createChondruleFurnace' },

  // --- Batch 37 ---
  { id: 'radio_glove', name: 'Glovebox', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_glovebox.js', importName: 'createGlovebox' },
  { id: 'radio_geiger', name: 'Geiger Counter', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_geiger_counter.js', importName: 'createGeigerCounter' },
  { id: 'radio_hotcell', name: 'Hot Cell', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_hot_cell.js', importName: 'createHotCell' },
  { id: 'radio_centrifuge', name: 'Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_centrifuge.js', importName: 'createCentrifuge' },
  { id: 'radio_vial', name: 'Scintillation Vial', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_scintillation_vial.js', importName: 'createScintillationVial' },

  { id: 'helio_wind', name: 'Solar Wind Analyzer', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_solar_wind_analyzer.js', importName: 'createSolarWindAnalyzer' },
  { id: 'helio_cme', name: 'CME Tracker', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_cme_tracker.js', importName: 'createCMETracker' },
  { id: 'helio_flare', name: 'Solar Flare Detector', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_solar_flare_detector.js', importName: 'createSolarFlareDetector' },
  { id: 'helio_mag', name: 'Magnetosphere Mapper', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_magnetosphere_mapper.js', importName: 'createMagnetosphereMapper' },
  { id: 'helio_imager', name: 'Heliospheric Imager', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_heliospheric_imager.js', importName: 'createHeliosphericImager' },


  { id: 'spatio_wormhole', name: 'Wormhole', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_wormhole.js', importName: 'createWormhole' },
  { id: 'spatio_tesseract', name: 'Tesseract', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_tesseract.js', importName: 'createTesseract' },
  { id: 'spatio_lightcone', name: 'Light Cone', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_lightcone.js', importName: 'createLightCone' },
  { id: 'spatio_grav', name: 'Gravitational Wave', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_gravitational_wave.js', importName: 'createGravitationalWave' },
  { id: 'spatio_chronosphere', name: 'Chronosphere', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_chronosphere.js', importName: 'createChronosphere' },


  // --- Batch 36 ---
  { id: 'sono_bath', name: 'Ultrasonic Bath', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_ultrasonic_bath.js', importName: 'createUltrasonicBath' },
  { id: 'sono_probe', name: 'Probe Sonicator', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_probe_sonicator.js', importName: 'createProbeSonicator' },
  { id: 'sono_cavitation', name: 'Cavitation Bubble', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_cavitation_bubble.js', importName: 'createCavitationBubble' },
  { id: 'sono_reactor', name: 'Sonochemical Reactor', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_reactor.js', importName: 'createSonochemicalReactor' },

  { id: 'tribo_wimshurst', name: 'Wimshurst Machine', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_wimshurst_machine.js', importName: 'createWimshurstMachine' },
  { id: 'tribo_vandegraaff', name: 'Van de Graaff Generator', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_vandegraaff_generator.js', importName: 'createVanDeGraaffGenerator' },
  { id: 'tribo_kelvin', name: 'Kelvin Water Dropper', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_kelvin_water_dropper.js', importName: 'createKelvinWaterDropper' },
  { id: 'tribo_electrophorus', name: 'Electrophorus', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_electrophorus.js', importName: 'createElectrophorus' },
  { id: 'tribo_faraday', name: 'Faraday Ice Pail', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_faraday_ice_pail.js', importName: 'createFaradayIcePail' },

  { id: 'thermo_peltier', name: 'Peltier Cooler', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_peltier_cooler.js', importName: 'createPeltierCooler' },
  { id: 'thermo_seebeck', name: 'Seebeck Generator', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_seebeck_generator.js', importName: 'createSeebeckGenerator' },
  { id: 'thermo_rtg', name: 'Radioisotope Thermoelectric Generator', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_rtg.js', importName: 'createRTG' },
  { id: 'thermo_thomson', name: 'Thomson Effect Demo', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_thomson_effect_demo.js', importName: 'createThomsonEffectDemo' },
  { id: 'thermo_pn', name: 'P-N Junction Couple', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_pn_junction_couple.js', importName: 'createPNJunctionCouple' },

  { id: 'phono_crystal', name: 'Phononic Crystal Lattice', icon: '&#x2699;&#xFE0F;', category: 'phononics', importPath: './machines/phononics_crystal_lattice.js', importName: 'createPhononicCrystalLattice' },
  { id: 'phono_waveguide', name: 'Phonon Waveguide', icon: '&#x2699;&#xFE0F;', category: 'phononics', importPath: './machines/phononics_phonon_waveguide.js', importName: 'createPhononWaveguide' },
  { id: 'phono_diode', name: 'Thermal Diode', icon: '&#x2699;&#xFE0F;', category: 'phononics', importPath: './machines/phononics_thermal_diode.js', importName: 'createThermalDiode' },
  { id: 'phono_saw', name: 'SAW Resonator', icon: '&#x2699;&#xFE0F;', category: 'phononics', importPath: './machines/phononics_saw_resonator.js', importName: 'createSAWResonator' },

  { id: 'mag_waveguide', name: 'Spin Waveguide', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_spin_waveguide.js', importName: 'createSpinWaveguide' },
  { id: 'mag_crystal', name: 'Magnonic Crystal', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_crystal.js', importName: 'createMagnonicCrystal' },
  { id: 'mag_oscillator', name: 'Spin Torque Oscillator', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_spin_torque_oscillator.js', importName: 'createSpinTorqueOscillator' },
  { id: 'mag_logic', name: 'Magnonic Logic Gate', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_logic_gate.js', importName: 'createMagnonicLogicGate' },
  { id: 'mag_transistor', name: 'Magnon Transistor', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_magnon_transistor.js', importName: 'createMagnonTransistor' },

  // --- Batch 35 ---
  { id: 'meta_srr', name: 'Split-Ring Resonator', icon: '&#x2699;&#xFE0F;', category: 'metamaterials', importPath: './machines/metamaterials_split_ring_resonator.js', importName: 'createSplitRingResonatorArray' },
  { id: 'meta_auxetic', name: 'Auxetic Structure', icon: '&#x2699;&#xFE0F;', category: 'metamaterials', importPath: './machines/metamaterials_auxetic_structure.js', importName: 'createAuxeticStructure' },
  { id: 'meta_photonic', name: 'Photonic Crystal Waveguide', icon: '&#x2699;&#xFE0F;', category: 'metamaterials', importPath: './machines/metamaterials_photonic_crystal.js', importName: 'createPhotonicCrystalWaveguide' },
  { id: 'meta_thermal', name: 'Thermal Cloak', icon: '&#x2699;&#xFE0F;', category: 'metamaterials', importPath: './machines/metamaterials_thermal_cloak.js', importName: 'createThermalCloak' },

  { id: 'cyber_neural', name: 'Neural Interface', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_neural_interface.js', importName: 'createNeuralInterface' },
  { id: 'cyber_arm', name: 'Bionic Prosthetic Arm', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_bionic_arm.js', importName: 'createBionicArm' },
  { id: 'cyber_retina', name: 'Synthetic Retina', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_synthetic_retina.js', importName: 'createSyntheticRetina' },
  { id: 'cyber_exo', name: 'Exoskeleton Joint', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_exoskeleton_joint.js', importName: 'createExoskeletonJoint' },
  { id: 'cyber_bci', name: 'Brain-Computer Interface', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_bci_array.js', importName: 'createBCIArray' },


  { id: 'xeno_warp', name: 'Warp Core', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_warp_core.js', importName: 'createWarpCore' },
  { id: 'xeno_grav', name: 'Gravity Inverter', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_gravity_inverter.js', importName: 'createGravityInverter' },
  { id: 'xeno_plasma', name: 'Plasma Conduit', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_plasma_conduit.js', importName: 'createPlasmaConduit' },
  { id: 'xeno_quantum', name: 'Quantum Resonator', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_quantum_resonator.js', importName: 'createQuantumResonator' },
  { id: 'xeno_tess', name: 'Tesseract Engine', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_tesseract_engine.js', importName: 'createTesseractEngine' },

  { id: 'astrochem_ice', name: 'Interstellar Ice Dust', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_interstellar_ice_dust.js', importName: 'createInterstellarIceDust' },
  { id: 'astrochem_coma', name: 'Cometary Coma', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_cometary_coma.js', importName: 'createCometaryComa' },
  { id: 'astrochem_cloud', name: 'Molecular Cloud', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_molecular_cloud.js', importName: 'createMolecularCloud' },
  { id: 'astrochem_disk', name: 'Protoplanetary Disk', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_protoplanetary_disk.js', importName: 'createProtoplanetaryDisk' },
  { id: 'astrochem_spectro', name: 'Radio Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_spectrometer.js', importName: 'createAstrochemistrySpectrometer' },

  // --- Batch 26 ---
  { id: 'nano_nanobot', name: 'Nanobot', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_nanobot.js', importName: 'createNanobot' },
  { id: 'nano_cnt', name: 'Carbon Nanotube', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_carbon_nanotube.js', importName: 'createCarbonNanotube' },
  { id: 'nano_graphene', name: 'Graphene Sheet', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_graphene.js', importName: 'createGraphene' },
  { id: 'nano_motor', name: 'Molecular Motor', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_molecular_motor.js', importName: 'createMolecularMotor' },
  { id: 'nano_origami', name: 'DNA Origami', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_dna_origami.js', importName: 'createDNAOrigami' },
  { id: 'astro_solar', name: 'Solar System', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_solar_system.js', importName: 'createSolarSystem' },
  { id: 'astro_pulsar', name: 'Pulsar', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_pulsar.js', importName: 'createPulsar' },
  { id: 'astro_blackhole', name: 'Black Hole', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_black_hole.js', importName: 'createBlackHole' },
  { id: 'astro_binary', name: 'Binary Star', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_binary_star.js', importName: 'createBinaryStar' },
  { id: 'astro_galaxy', name: 'Galaxy', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_galaxy.js', importName: 'createGalaxy' },
  { id: 'ocean_auv', name: 'Roaming Submersible', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_roaming_submersible.js', importName: 'createRoamingSubmersible' },
  { id: 'ocean_buoy', name: 'Buoy Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_buoy_sensor_array.js', importName: 'createBuoySensorArray' },
  { id: 'ocean_tidal', name: 'Tidal Turbine', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_tidal_turbine.js', importName: 'createTidalTurbine' },
  { id: 'ocean_seismo', name: 'Seafloor Seismometer', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_seafloor_seismometer.js', importName: 'createSeafloorSeismometer' },
  { id: 'ocean_glider', name: 'Underwater Glider', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_glider.js', importName: 'createUnderwaterGlider' },
  { id: 'meteor_radar', name: 'Weather Radar', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_radar.js', importName: 'createWeatherRadar' },
  { id: 'meteor_anemometer', name: 'Anemometer', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_anemometer.js', importName: 'createAnemometer' },
  { id: 'meteor_radiosonde', name: 'Radiosonde', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_radiosonde.js', importName: 'createRadiosonde' },
  { id: 'meteor_station', name: 'Weather Station', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_station.js', importName: 'createWeatherStation' },
  { id: 'meteor_satellite', name: 'Weather Satellite', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_satellite.js', importName: 'createWeatherSatellite' },
  { id: 'climate_station', name: 'Climate Weather Station', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_weather_station.js', importName: 'createWeatherStation' },
  { id: 'climate_radar', name: 'Doppler Radar', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'climate_buoy', name: 'Ocean Buoy', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_ocean_buoy.js', importName: 'createOceanBuoy' },
  { id: 'climate_lidar', name: 'Atmospheric Lidar', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_atmospheric_lidar.js', importName: 'createAtmosphericLidar' },
  { id: 'climate_drill', name: 'Ice Core Drill', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_ice_core_drill.js', importName: 'createIceCoreDrill' },

  // --- Batch 27 ---
  { id: 'pharm_receptor', name: 'Receptor Binding', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_receptor_binding.js', importName: 'createReceptorBindingModel' },
  { id: 'pharm_metab', name: 'Drug Metabolism', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_drug_metabolism.js', importName: 'createDrugMetabolismModel' },
  { id: 'pharm_ion', name: 'Ion Channel', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_ion_channel.js', importName: 'createIonChannelModel' },
  { id: 'pharm_nano', name: 'Nanoparticle Delivery', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_nanoparticle_delivery.js', importName: 'createNanoparticleDeliveryModel' },
  { id: 'optics_laser_v2', name: 'Laser Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_laser_interferometer.js', importName: 'createLaserInterferometer' },
  { id: 'optics_spectro', name: 'Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_spectrometer.js', importName: 'createSpectrometer' },
  { id: 'optics_micro', name: 'Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/electron_microscope.js', importName: 'createElectronMicroscope' },
  { id: 'optics_telescope_v2', name: 'Reflecting Telescope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_telescope_reflector.js', importName: 'createReflectingTelescope' },

  // --- Batch 28 ---
  { id: 'virology_phage', name: 'Bacteriophage T4', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/virology_bacteriophage.js', importName: 'createBacteriophage' },
  { id: 'virology_corona', name: 'SARS-CoV-2', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/virology_coronavirus.js', importName: 'createCoronavirus' },
  { id: 'virology_hiv', name: 'HIV Retrovirus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/hiv.js', importName: 'createHIV' },
  { id: 'virology_ebola', name: 'Ebola Virus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/ebola.js', importName: 'createEbola' },
  { id: 'virology_adeno', name: 'Adenovirus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/virology_adenovirus.js', importName: 'createAdenovirus' },
  { id: 'epidem_sir', name: 'SIR Model', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_sir_model.js', importName: 'createSIRModelVisualizer' },
  { id: 'epidem_network', name: 'Virus Spreading', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_virus_network.js', importName: 'createVirusSpreadingNetwork' },
  { id: 'epidem_anatomy', name: 'Pathogen Anatomy', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_pathogen_anatomy.js', importName: 'createPathogenAnatomy' },
  { id: 'epidem_vaccine', name: 'Vaccine Mechanism', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_vaccine_mechanism.js', importName: 'createVaccineMechanism' },
  { id: 'epidem_curve', name: 'Epidemic Curve', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_epidemic_curve.js', importName: 'createEpidemicCurvePlotter' },

  // --- Batch 29 ---
  { id: 'onco_linac', name: 'Linear Accelerator', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/oncology_linac.js', importName: 'createLinac' },
  { id: 'onco_petct', name: 'PET-CT Scanner', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/pet_ct_scanner.js', importName: 'createPETCTScanner' },
  { id: 'onco_cyber', name: 'CyberKnife', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/oncology_cyberknife.js', importName: 'createCyberKnife' },
  { id: 'onco_gamma', name: 'Gamma Knife', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/oncology_gamma_knife.js', importName: 'createGammaKnife' },
  { id: 'onco_brachy', name: 'Brachytherapy', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/brachytherapy_afterloader.js', importName: 'createBrachytherapyAfterloader' },
  { id: 'cyto_animal', name: 'Animal Cell', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_animal_cell.js', importName: 'createAnimalCell' },
  { id: 'cyto_mito', name: 'Mitochondrion', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_mitochondrion.js', importName: 'createMitochondrion' },
  { id: 'cyto_membrane', name: 'Cell Membrane', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_cell_membrane.js', importName: 'createCellMembrane' },
  { id: 'cyto_nucleus', name: 'Nucleus & DNA', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_nucleus_dna.js', importName: 'createNucleusDNA' },
  { id: 'cyto_golgi', name: 'Golgi Apparatus', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_golgi_apparatus.js', importName: 'createGolgiApparatus' },
  { id: 'histo_microtome', name: 'Microtome', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_microtome.js', importName: 'createHistologyMicrotome' },
  { id: 'histo_tissue', name: 'Tissue Processor', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_tissue_processor.js', importName: 'createHistologyTissueProcessor' },
  { id: 'histo_microscope', name: 'Light Microscope', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_light_microscope.js', importName: 'createHistologyLightMicroscope' },
  { id: 'histo_stainer', name: 'Slide Stainer', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_slide_stainer.js', importName: 'createHistologySlideStainer' },
  { id: 'histo_embedding', name: 'Embedding Center', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_embedding_center.js', importName: 'createHistologyEmbeddingCenter' },
  { id: 'seismo_graph', name: 'Seismograph', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismograph.js', importName: 'createSeismograph' },
  { id: 'seismo_plates', name: 'Tectonic Plates', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismology_tectonic_plates.js', importName: 'createTectonicPlates' },
  { id: 'seismo_epicenter', name: 'Earthquake Epicenter', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismology_earthquake_epicenter.js', importName: 'createEarthquakeEpicenter' },
  { id: 'seismo_buoy', name: 'Tsunami Buoy', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/tsunami_buoy.js', importName: 'createTsunamiBuoy' },
  { id: 'seismo_fault', name: 'Fault Line', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismology_fault_line.js', importName: 'createFaultLine' },

  // --- Batch 30 ---
  { id: 'volcano_strato', name: 'Stratovolcano', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_stratovolcano.js', importName: 'createStratovolcano' },
  { id: 'volcano_shield', name: 'Shield Volcano', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_shield_volcano.js', importName: 'createShieldVolcano' },
  { id: 'volcano_magma', name: 'Magma Chamber', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_magma_chamber.js', importName: 'createMagmaChamber' },
  { id: 'volcano_seismo', name: 'Seismometer Station', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_seismometer.js', importName: 'createSeismometerStation' },
  { id: 'volcano_ash', name: 'Volcanic Ash Plume', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_ash_plume.js', importName: 'createAshPlume' },
  { id: 'ca_cache', name: 'Cache Hierarchy', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/computer_architecture_cache_hierarchy.js', importName: 'createCacheHierarchy' },
  { id: 'ca_vonneumann', name: 'Von Neumann Architecture', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/computer_architecture_von_neumann.js', importName: 'createVonNeumann' },
  { id: 'ca_alu', name: 'ALU', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/computer_architecture_alu.js', importName: 'createAlu' },
  { id: 'ca_turing', name: 'Turing Machine', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/computer_architecture_turing_machine.js', importName: 'createTuringMachine' },
  { id: 'net_router', name: 'Router', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/networking_router.js', importName: 'createRouterModel' },
  { id: 'net_switch_v2', name: 'Network Switch', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/networking_switch.js', importName: 'createSwitchModel' },
  { id: 'net_datacenter', name: 'Data Center Rack', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/networking_datacenter_rack.js', importName: 'createDataCenterRack' },
  { id: 'crypto_enigma', name: 'Enigma Machine', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_enigma_machine.js', importName: 'createEnigmaMachine' },
  { id: 'crypto_rsa', name: 'RSA Encryption', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_rsa_encryption.js', importName: 'createRSAEncryption' },
  { id: 'crypto_blockchain', name: 'Blockchain Ledger', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/blockchain_ledger.js', importName: 'createBlockchainLedger' },
  { id: 'crypto_qkd', name: 'Quantum Key Distribution', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_quantum_key_distribution.js', importName: 'createQuantumKeyDistribution' },
  { id: 'crypto_sha', name: 'SHA-256 Hash', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_sha256_hash.js', importName: 'createSHA256Hash' },
  { id: 'ai_neural', name: 'AI Neural Network', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/artificial_intelligence_neural_network.js', importName: 'createNeuralNetwork' },
  { id: 'ai_quantum', name: 'Quantum Processor', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/artificial_intelligence_quantum_processor.js', importName: 'createQuantumProcessor' },
  { id: 'ai_holo', name: 'Holographic Core', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/artificial_intelligence_holographic_core.js', importName: 'createHolographicCore' },
  { id: 'ai_nexus', name: 'Data Nexus', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/artificial_intelligence_data_nexus.js', importName: 'createDataNexus' },
  { id: 'ai_cog', name: 'Cognitive Array', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/artificial_intelligence_cognitive_array.js', importName: 'createCognitiveArray' },

  // --- Batch 31 ---
  { id: 'os_cpu', name: 'CPU Scheduler', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/operating_systems_cpu_scheduler.js', importName: 'createCPUScheduler' },
  { id: 'os_memory', name: 'Memory Paging', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/operating_systems_memory_paging.js', importName: 'createMemoryPagingSystem' },
  { id: 'os_fs', name: 'File System Tree', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/operating_systems_file_system.js', importName: 'createFileSystemTree' },
  { id: 'os_deadlock', name: 'Deadlock Detection', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/operating_systems_deadlock_detection.js', importName: 'createDeadlockDetection' },
  { id: 'os_context', name: 'Context Switch', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/operating_systems_context_switch.js', importName: 'createContextSwitch' },
  { id: 'aero_wind', name: 'Wind Tunnel', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_wind_tunnel.js', importName: 'createWindTunnel' },
  { id: 'aero_lift', name: 'Airfoil Lift', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_airfoil_lift.js', importName: 'createAirfoilLift' },
  { id: 'aero_thrust', name: 'Propeller Thrust', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_propeller_thrust.js', importName: 'createPropellerThrust' },
  { id: 'aero_magnus', name: 'Magnus Effect', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_magnus_effect.js', importName: 'createMagnusEffect' },
  { id: 'aero_shock', name: 'Shock Wave', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_shock_wave.js', importName: 'createShockWave' },
  { id: 'prop_scramjet_v2', name: 'Scramjet Engine', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/propulsion_systems_scramjet.js', importName: 'createScramjet' },
  { id: 'prop_solid', name: 'Solid Rocket Booster', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/propulsion_systems_solid_rocket.js', importName: 'createSolidRocket' },
  { id: 'prop_nuclear', name: 'Nuclear Thermal Rocket', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/propulsion_systems_nuclear_thermal.js', importName: 'createNuclearThermal' },
  { id: 'prop_hall', name: 'Hall Effect Thruster', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/propulsion_systems_hall_effect.js', importName: 'createHallEffectThruster' },
  { id: 'orbit_two', name: 'Two-Body Orbit', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/orbital_mechanics_two_body.js', importName: 'createTwoBodyOrbit' },
  { id: 'orbit_hohmann', name: 'Hohmann Transfer', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/orbital_mechanics_hohmann_transfer.js', importName: 'createHohmannTransfer' },
  { id: 'orbit_three', name: 'Three-Body Problem', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/orbital_mechanics_three_body.js', importName: 'createThreeBodyProblem' },
  { id: 'orbit_constellation', name: 'Satellite Constellation', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/orbital_mechanics_satellite_constellation.js', importName: 'createSatelliteConstellation' },
  { id: 'orbit_kepler', name: 'Kepler Laws', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/orbital_mechanics_kepler_laws.js', importName: 'createKeplersLaws' },
  { id: 'avio_gyro', name: 'Gyroscope', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_gyroscope.js', importName: 'createAvionicsGyroscope' },
  { id: 'avio_radar', name: 'Radar Antenna', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_radar_antenna.js', importName: 'createAvionicsRadarAntenna' },
  { id: 'avio_alt', name: 'Altimeter', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_altimeter.js', importName: 'createAvionicsAltimeter' },
  { id: 'avio_fcu', name: 'Flight Computer', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_flight_computer.js', importName: 'createAvionicsFlightComputer' },
  { id: 'avio_pitot', name: 'Pitot Tube', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_pitot_tube.js', importName: 'createAvionicsPitotTube' },

  // --- Batch 32 ---
  { id: 'astro_bio', name: 'Biosignature Detector', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_biosignature_detector.js', importName: 'createBiosignatureDetector' },
  { id: 'astro_exo', name: 'Exoplanet Incubator', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_exoplanet_incubator.js', importName: 'createExoplanetIncubator' },
  { id: 'astro_pan', name: 'Panspermia Vessel', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_panspermia_vessel.js', importName: 'createPanspermiaVessel' },
  { id: 'astro_micro', name: 'Xenobiology Microscope', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_xenobiology_microscope.js', importName: 'createXenobiologyMicroscope' },
  { id: 'astro_ext', name: 'Extremophile Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_extremophile_centrifuge.js', importName: 'createExtremophileCentrifuge' },
  { id: 'paleo_ice', name: 'Ice Core Drill', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_ice_core_drill.js', importName: 'createIceCoreDrill' },
  { id: 'paleo_sediment', name: 'Sediment Corer', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_sediment_corer.js', importName: 'createSedimentCorer' },
  { id: 'paleo_mass', name: 'Mass Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_mass_spectrometer.js', importName: 'createMassSpectrometer' },
  { id: 'paleo_dendro', name: 'Dendrochronology Scanner', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_dendrochronology_scanner.js', importName: 'createDendrochronologyScanner' },
  { id: 'paleo_climate', name: 'Climate Chamber', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_climate_chamber.js', importName: 'createClimateChamber' },
  { id: 'nano_lipo', name: 'Drug Delivery Liposome', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_drug_delivery_liposome.js', importName: 'createDrugDeliveryLiposome' },
  { id: 'nano_gold', name: 'Gold Nanoshell', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_gold_nanoshell.js', importName: 'createGoldNanoshell' },
  { id: 'nano_exo', name: 'Targeted Exosome', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_targeted_exosome.js', importName: 'createTargetedExosome' },
  { id: 'nano_mag', name: 'Magnetic Nanoparticle Swarm', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_magnetic_nanoparticle_swarm.js', importName: 'createMagneticNanoparticleSwarm' },
  { id: 'space_ion', name: 'Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/spacecraft_engineering_ion_thruster.js', importName: 'createIonThruster' },
  { id: 'space_reaction', name: 'Reaction Wheel', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/spacecraft_engineering_reaction_wheel.js', importName: 'createReactionWheel' },
  { id: 'space_solar_v2', name: 'Solar Array', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/spacecraft_engineering_solar_array.js', importName: 'createSolarArray' },
  { id: 'space_cmg', name: 'Control Moment Gyroscope', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/spacecraft_engineering_cmg.js', importName: 'createControlMomentGyroscope' },
  { id: 'space_star', name: 'Star Tracker', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/spacecraft_engineering_star_tracker.js', importName: 'createStarTracker' },

  // --- Batch 33 ---
  { id: 'agro_irrig', name: 'Smart Irrigation', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_smart_irrigation.js', importName: 'createSmartIrrigation' },
  { id: 'agro_sensor', name: 'Soil Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_soil_sensor_array.js', importName: 'createSoilSensorArray' },
  { id: 'agro_drone', name: 'Drone Sprayer', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_drone_sprayer.js', importName: 'createDroneSprayer' },
  { id: 'agro_hydro', name: 'Hydroponic Tower', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_hydroponic_tower.js', importName: 'createHydroponicTower' },
  { id: 'agro_tractor', name: 'Autonomous Tractor', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_autonomous_tractor.js', importName: 'createAutonomousTractor' },
  { id: 'cryo_liquefier', name: 'Liquefier', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryogenics_liquefier.js', importName: 'createLiquefier' },
  { id: 'cryo_dilution', name: 'Dilution Refrigerator', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryogenics_dilution_refrigerator.js', importName: 'createDilutionRefrigerator' },
  { id: 'cryo_dewar', name: 'Dewar Flask', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryogenics_dewar_flask.js', importName: 'createDewarFlask' },
  { id: 'cryo_pump', name: 'Cryopump', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryogenics_cryopump.js', importName: 'createCryopump' },
  { id: 'cryo_magnet', name: 'Superconducting Magnet', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryogenics_superconducting_magnet.js', importName: 'createSuperconductingMagnet' },
  { id: 'plasma_tokamak', name: 'Tokamak Reactor', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_physics_tokamak.js', importName: 'createTokamak' },
  { id: 'plasma_stellar', name: 'Stellarator', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_physics_stellarator.js', importName: 'createStellarator' },
  { id: 'plasma_hall', name: 'Hall Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_physics_hall_thruster.js', importName: 'createHallThruster' },
  { id: 'plasma_zpinch', name: 'Z-Pinch Device', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_physics_z_pinch.js', importName: 'createZPinch' },
  { id: 'plasma_icf', name: 'ICF Chamber', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_physics_icf_chamber.js', importName: 'createICFChamber' },
  { id: 'glac_flow', name: 'Glacier Flow', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_glacier_flow.js', importName: 'createGlacierFlow' },
  { id: 'glac_drill', name: 'Ice Core Drill', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_ice_core_drill.js', importName: 'createIceCoreDrill' },
  { id: 'glac_probe', name: 'Subglacial Probe', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_subglacial_probe.js', importName: 'createSubglacialProbe' },
  { id: 'glac_radar', name: 'Crevasse Radar', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_crevasse_radar.js', importName: 'createCrevasseRadar' },
  { id: 'glac_calving', name: 'Calving Shelf', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_calving_shelf.js', importName: 'createCalvingShelf' },

  // --- Batch 34 ---
  { id: 'phot_inter', name: 'Interferometer', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_interferometer.js', importName: 'createInterferometer' },
  { id: 'phot_fiber', name: 'Fiber Optic Cable', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_fiber_optic.js', importName: 'createFiberOptic' },
  { id: 'phot_laser', name: 'Laser Cavity', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_laser_cavity.js', importName: 'createLaserCavity' },
  { id: 'phot_prism', name: 'Prism Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_prism.js', importName: 'createPrismSpectrometer' },
  { id: 'phot_tweezer', name: 'Optical Tweezer', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_optical_tweezer.js', importName: 'createOpticalTweezer' },
  { id: 'tecto_sub', name: 'Subduction Zone', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_subduction_zone.js', importName: 'createSubductionZone' },
  { id: 'tecto_mantle', name: 'Mantle Convection', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_mantle_convection.js', importName: 'createMantleConvection' },
  { id: 'tecto_fault', name: 'Transform Fault', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_transform_fault.js', importName: 'createTransformFault' },
  { id: 'tecto_sea', name: 'Seafloor Spreading', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_seafloor_spreading.js', importName: 'createSeafloorSpreading' },
  { id: 'tecto_col', name: 'Continental Collision', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_continental_collision.js', importName: 'createContinentalCollision' },
  { id: 'rheo_capillary', name: 'Capillary Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_capillary_rheometer.js', importName: 'createCapillaryRheometer' },
  { id: 'rheo_rotational', name: 'Rotational Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_rotational_rheometer.js', importName: 'createRotationalRheometer' },
  { id: 'rheo_extensional', name: 'Extensional Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_extensional_rheometer.js', importName: 'createExtensionalRheometer' },
  { id: 'rheo_falling', name: 'Falling Ball Viscometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_falling_ball_viscometer.js', importName: 'createFallingBallViscometer' },
  { id: 'rheo_oscillatory', name: 'Oscillatory Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_oscillatory_rheometer.js', importName: 'createOscillatoryRheometer' },
  { id: 'tribo_ball', name: 'Ball-on-Disk Tribometer', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_ball_on_disk.js', importName: 'createBallOnDisk' },
  { id: 'tribo_journal', name: 'Journal Bearing', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_journal_bearing.js', importName: 'createJournalBearing' },
  { id: 'tribo_stribeck', name: 'Stribeck Apparatus', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_stribeck_apparatus.js', importName: 'createStribeckApparatus' },
  { id: 'tribo_surface', name: 'Surface Asperities', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_surface_asperities.js', importName: 'createSurfaceAsperities' },
  { id: 'tribo_four', name: 'Four-Ball Tester', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_four_ball_tester.js', importName: 'createFourBallTester' },
  { id: 'spin_valve', name: 'Spin Valve', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_spin_valve.js', importName: 'createSpinValve' },
  { id: 'spin_mtj', name: 'Magnetic Tunnel Junction', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_magnetic_tunnel_junction.js', importName: 'createMagneticTunnelJunction' },
  { id: 'spin_sto', name: 'Spin Torque Oscillator', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_spin_torque_oscillator.js', importName: 'createSpinTorqueOscillator' },
  { id: 'spin_fet', name: 'Datta-Das Transistor', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_datta_das_transistor.js', importName: 'createDattaDasTransistor' },
  { id: 'spin_race', name: 'Racetrack Memory', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_racetrack_memory.js', importName: 'createRacetrackMemory' },



  // --- Batch 24 ---

  { id: 'nuclear_cooling', name: 'Nuclear Cooling Tower', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_cooling_tower.js', importName: 'createCoolingTower' },
  { id: 'nuclear_centrifuge', name: 'Nuclear Centrifuge Cascade', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_centrifuge_cascade.js', importName: 'createNuclearCentrifugeCascade' },
  { id: 'nuclear_tokamak', name: 'Tokamak Fusion Reactor', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_tokamak_fusion_reactor.js', importName: 'createNuclearTokamakFusionReactor' },
  { id: 'nuclear_steam', name: 'Nuclear Steam Generator', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_steam_generator.js', importName: 'createSteamGenerator' },

  { id: 'fluids_vortex', name: 'Vortex Shedding', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_vortex_shedding.js', importName: 'createVortexShedding' },
  { id: 'fluids_navier', name: 'Navier-Stokes Grid', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_navier_stokes_grid.js', importName: 'createNavierStokesGrid' },
  { id: 'fluids_capillary', name: 'Capillary Wave', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_capillary_wave.js', importName: 'createCapillaryWave' },
  { id: 'fluids_laminar', name: 'Laminar/Turbulent Pipe', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_laminar_turbulent_pipe.js', importName: 'createLaminarTurbulentPipe' },
  { id: 'fluids_sph', name: 'SPH Dam Break', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_sph_dam_break.js', importName: 'createSPHDamBreak' },


  { id: 'inorganic_lattice', name: 'NaCl Crystal Lattice', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_crystal_lattice.js', importName: 'createCrystalLattice' },
  { id: 'inorganic_complex', name: 'Coordination Complex', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_coordination_complex.js', importName: 'createCoordinationComplex' },
  { id: 'inorganic_zeolite', name: 'Zeolite Framework', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_zeolite_framework.js', importName: 'createZeoliteFramework' },
  { id: 'inorganic_cnt', name: 'Carbon Nanotube', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/nanotechnology_carbon_nanotube.js', importName: 'createCarbonNanotube' },
  { id: 'inorganic_mof', name: 'Metal-Organic Framework', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_metal_organic_framework.js', importName: 'createMetalOrganicFramework' },

  // --- Batch 25 ---
  { id: 'algebra_quad', name: 'Quadratic Surface', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_quadratic_surface.js', importName: 'createQuadraticSurface' },
  { id: 'algebra_vector', name: 'Vector Field', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_vector_field.js', importName: 'createVectorField' },
  { id: 'algebra_eigen', name: 'Eigenvector Transform', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_eigenvector_transform.js', importName: 'createEigenvectorTransform' },
  { id: 'algebra_roots', name: 'Complex Roots of Unity', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_complex_roots.js', importName: 'createComplexRoots' },
  { id: 'algebra_matrix', name: 'Matrix Multiplication', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_matrix_multiplication.js', importName: 'createMatrixMultiplication' },

  { id: 'stat_normal', name: 'Normal Distribution', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_normal_distribution.js', importName: 'createNormalDistribution' },
  { id: 'stat_galton', name: 'Galton Board', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_galton_board.js', importName: 'createGaltonBoard' },
  { id: 'stat_scatter', name: 'Linear Regression', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_scatter_plot_regression.js', importName: 'createScatterPlotRegression' },
  { id: 'stat_markov', name: 'Markov Chain States', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_markov_chain.js', importName: 'createMarkovChain' },
  { id: 'stat_clt', name: 'Central Limit Theorem', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_central_limit_theorem.js', importName: 'createCentralLimitTheorem' },

  { id: 'topo_mobius', name: 'Mobius Strip', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_mobius_strip.js', importName: 'createMobiusStrip' },
  { id: 'topo_klein', name: 'Klein Bottle', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_klein_bottle.js', importName: 'createKleinBottle' },
  { id: 'topo_torus', name: 'Torus Knot', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_torus_knot.js', importName: 'createTorusKnot' },
  { id: 'topo_seifert', name: 'Seifert Surface', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_seifert_surface.js', importName: 'createSeifertSurface' },
  { id: 'topo_hopf', name: 'Hopf Fibration', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_hopf_fibration.js', importName: 'createHopfFibration' },

  { id: 'geom_tesseract', name: '4D Tesseract', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_tesseract.js', importName: 'createTesseract' },
  { id: 'geom_mobius', name: 'Parametric Mobius Strip', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_mobius.js', importName: 'createMobiusStrip' },
  { id: 'geom_platonic', name: 'Nested Platonic Solids', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_nested_platonic.js', importName: 'createNestedPlatonicSolids' },
  { id: 'geom_menger', name: 'Menger Sponge', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_menger_sponge.js', importName: 'createMengerSponge' },
  { id: 'geom_pseudo', name: 'Pseudosphere', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_pseudosphere.js', importName: 'createPseudosphere' },

  { id: 'calc_riemann', name: 'Riemann Sum', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_riemann_sum.js', importName: 'createRiemannSum' },
  { id: 'calc_tangent', name: 'Tangent Plane', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_tangent_plane.js', importName: 'createTangentPlane' },
  { id: 'calc_solid', name: 'Solid of Revolution', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_solid_revolution.js', importName: 'createSolidRevolution' },
  { id: 'calc_vector', name: 'Curl & Divergence', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_vector_field.js', importName: 'createVectorField' },
  { id: 'calc_taylor', name: 'Taylor Series Surface', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_taylor_series.js', importName: 'createTaylorSeries' },
// --- Batch 24: Nuclear, Biomedical, Fluids, Organic, Inorganic ---
  { id: 'jet_engine', name: 'Turbofan Jet Engine', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/jet_engine.js', importName: 'createJetEngine' },
  { id: 'airfoil', name: 'Airfoil Section', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/airfoil.js', importName: 'createAirfoil' },
  { id: 'supersonic', name: 'De Laval Supersonic Nozzle', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/supersonic_nozzle.js', importName: 'createSupersonicNozzle' },
  { id: 'ion_thruster_prop', name: 'Gridded Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/ion_thruster.js', importName: 'createIonThruster' },
  { id: 'scramjet', name: 'Scramjet Engine', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/scramjet_engine.js', importName: 'createScramjetEngine' },
  { id: 'hall_effect', name: 'Hall Effect Thruster', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/hall_effect_thruster.js', importName: 'createHallEffectThruster' },
  { id: 'nuclear_thermal', name: 'Nuclear Thermal Rocket', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/nuclear_thermal_rocket.js', importName: 'createNuclearThermalRocket' },
  { id: 'vasimr', name: 'VASIMR Engine', icon: '&#x2699;&#xFE0F;', category: 'propulsion_systems', importPath: './machines/vasimr_engine.js', importName: 'createVasimrEngine' },
  { id: 'fms', name: 'Flight Management System', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/flight_management_system.js', importName: 'createFlightManagementSystem' },
  { id: 'radar_alt', name: 'Radar Altimeter', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/radar_altimeter.js', importName: 'createRadarAltimeter' },
  { id: 'glass_cockpit', name: 'Glass Cockpit PFD', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/glass_cockpit_pfd.js', importName: 'createGlassCockpitPFD' },
  { id: 'ins', name: 'Inertial Navigation System', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/inertial_navigation_system.js', importName: 'createInertialNavigationSystem' },
  { id: 'air_data', name: 'Air Data Computer', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/air_data_computer.js', importName: 'createAirDataComputer' },
  { id: 'hohmann', name: 'Hohmann Transfer Orbit', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/hohmann_transfer.js', importName: 'createHohmannTransferOrbit' },
  { id: 'lagrange', name: 'Lagrange Points System', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/lagrange_points.js', importName: 'createLagrangePointsSystem' },
  { id: 'gravity_assist', name: 'Gravity Assist Maneuver', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/gravity_assist.js', importName: 'createGravityAssistManeuver' },
  { id: 'geosync', name: 'Geosynchronous Satellite', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/geosynchronous_satellite.js', importName: 'createGeosynchronousSatellite' },
  { id: 'orbital_res', name: 'Orbital Resonance System', icon: '&#x2699;&#xFE0F;', category: 'orbital_mechanics', importPath: './machines/orbital_resonance.js', importName: 'createOrbitalResonanceSystem' },
  { id: 'ion_thruster_space', name: 'Gridded Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/ion_thruster.js', importName: 'createIonThruster' },
  { id: 'mars_rover', name: 'Planetary Exploration Rover', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/mars_rover.js', importName: 'createMarsRover' },
  { id: 'comm_sat', name: 'Geostationary Comm Satellite', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/comm_satellite.js', importName: 'createCommSatellite' },
  { id: 'iss_module', name: 'Habitation Module', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/iss_module.js', importName: 'createIssModule' },
  { id: 'lunar_lander', name: 'Lunar Lander', icon: '&#x2699;&#xFE0F;', category: 'spacecraft_engineering', importPath: './machines/lunar_lander.js', importName: 'createLunarLander' },
  { id: 'memory_hierarchy', name: 'Cache & Memory Hierarchy', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/memory_hierarchy.js', importName: 'createMemoryHierarchy' },
  { id: 'gpu_architecture', name: 'GPU Streaming Multiprocessor', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/gpu_architecture.js', importName: 'createGpuArchitecture' },
  { id: 'ooo_execution', name: 'Out-of-Order Execution Core', icon: '&#x2699;&#xFE0F;', category: 'computer_architecture', importPath: './machines/ooo_execution.js', importName: 'createOooExecution' },
  { id: 'dc_switch', name: 'Data Center Switch', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/data_center_switch.js', importName: 'createDataCenterSwitch' },
  { id: 'cell_tower', name: 'Next-Gen Cell Tower', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/next_gen_cell_tower.js', importName: 'createNextGenCellTower' },
  { id: 'enigma', name: 'Enigma Machine', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/enigma_machine.js', importName: 'createEnigmaMachine' },
  { id: 'rsa_enc', name: 'RSA Encryption Model', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/rsa_encryption.js', importName: 'createRSAEncryption' },
  { id: 'blockchain', name: 'Blockchain Ledger', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/blockchain_ledger.js', importName: 'createBlockchainLedger' },
  { id: 'qkd', name: 'Quantum Key Distribution', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/quantum_key_distribution.js', importName: 'createQuantumKeyDistribution' },
  { id: 'aes_cipher', name: 'AES Cipher Engine', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/aes_cipher_engine.js', importName: 'createAESCipherEngine' },
  { id: 'dnn', name: 'Deep Neural Network', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/neural_network.js', importName: 'createDeepNeuralNetwork' },
  { id: 'transformer', name: 'Transformer Architecture', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/transformer_model.js', importName: 'createTransformerArchitecture' },
  { id: 'cnn', name: 'Convolutional Neural Network', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/cnn_architecture.js', importName: 'createConvolutionalNeuralNetwork' },
  { id: 'rl_loop', name: 'Reinforcement Learning Loop', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/reinforcement_learning.js', importName: 'createReinforcementLearningLoop' },
  { id: 'gan', name: 'Generative Adversarial Network', icon: '&#x2699;&#xFE0F;', category: 'artificial_intelligence', importPath: './machines/gan_architecture.js', importName: 'createGenerativeAdversarialNetwork' },
  { id: 'vmm', name: 'Virtual Memory Manager', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/virtual_memory_manager.js', importName: 'createVirtualMemoryManager' },
  { id: 'scheduler', name: 'Process Scheduler', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/process_scheduler.js', importName: 'createProcessScheduler' },
  { id: 'inode', name: 'File System Inode', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/file_system_inode.js', importName: 'createFileSystemInode' },
  { id: 'dma', name: 'I/O DMA Controller', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/io_dma_controller.js', importName: 'createIoDmaController' },
  { id: 'ipc', name: 'IPC Message Queue', icon: '&#x2699;&#xFE0F;', category: 'operating_systems', importPath: './machines/ipc_message_queue.js', importName: 'createIpcMessageQueue' },
  { id: 'greenhouse_effect', name: 'Greenhouse Effect Simulator', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/greenhouse_effect_simulator.js', importName: 'createGreenhouseEffectSimulator' },
  { id: 'thermohaline_circ', name: 'Ocean Thermohaline Circulation', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/ocean_thermohaline_circulation.js', importName: 'createOceanThermohalineCirculation' },
  { id: 'atmospheric_cell', name: 'Atmospheric Cell Dynamics', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/atmospheric_cell_dynamics.js', importName: 'createAtmosphericCellDynamics' },
  { id: 'carbon_cycle_bio', name: 'Carbon Cycle Biosphere', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/carbon_cycle_biosphere.js', importName: 'createCarbonCycleBiosphere' },
  { id: 'ice_core_drill', name: 'Ice Core Paleoclimate Drill', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/ice_core_paleoclimate_drill.js', importName: 'createIceCorePaleoclimateDrill' },
  { id: 'deep_sea_sub', name: 'Deep Sea Submersible', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/deep_sea_submersible.js', importName: 'createSubmersible' },
  { id: 'auv_glider', name: 'AUV Glider', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/auv_glider.js', importName: 'createAUVGlider' },
  { id: 'ocean_data_buoy', name: 'Ocean Data Buoy', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_data_buoy.js', importName: 'createOceanDataBuoy' },
  { id: 'seafloor_seismo', name: 'Seafloor Seismometer', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/seafloor_seismometer.js', importName: 'createSeafloorSeismometer' },
  { id: 'tidal_turbine', name: 'Tidal Energy Turbine', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/tidal_energy_turbine.js', importName: 'createTidalEnergyTurbine' },
  { id: 'stratovolcano', name: 'Stratovolcano', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/stratovolcano.js', importName: 'createStratovolcano' },
  { id: 'shield_volcano', name: 'Shield Volcano', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/shield_volcano.js', importName: 'createShieldVolcano' },
  { id: 'hydrothermal_vent_vol', name: 'Hydrothermal Vent', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/hydrothermal_vent.js', importName: 'createHydrothermalVent' },
  { id: 'caldera_system', name: 'Caldera System', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/caldera_system.js', importName: 'createCalderaSystem' },
  { id: 'volcano_monitor', name: 'Volcano Monitoring System', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcano_monitoring.js', importName: 'createVolcanoMonitoring' },
  { id: 'volcano_eruption', name: 'Volcano Eruption Simulator', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/volcano_eruption.js', importName: 'createVolcanoEruption' },
  { id: 'plate_tectonics', name: 'Plate Tectonics Simulator', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/plate_tectonics.js', importName: 'createPlateTectonics' },
  { id: 'seismograph', name: 'Seismograph', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/seismograph.js', importName: 'createSeismograph' },
  { id: 'geothermal_plant', name: 'Geothermal Energy Plant', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/geothermal_plant.js', importName: 'createGeothermalPlant' },
  { id: 'rock_cycle', name: 'Rock Cycle Simulator', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/rock_cycle.js', importName: 'createRockCycle' },
  { id: 'em_seismometer', name: 'Electromagnetic Seismometer', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/electromagnetic_seismometer.js', importName: 'createElectromagneticSeismometer' },
  { id: 'shake_table', name: 'Multi-Axis Shake Table', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/shake_table_simulator.js', importName: 'createShakeTableSimulator' },
  { id: 'tsunami_buoy', name: 'DART Tsunami Buoy System', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/tsunami_buoy_detector.js', importName: 'createTsunamiBuoyDetector' },
  { id: 'laser_strainmeter', name: 'Interferometric Laser Strainmeter', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/laser_strainmeter.js', importName: 'createLaserStrainmeter' },
  { id: 'obs', name: 'Ocean Bottom Seismometer (OBS)', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/ocean_bottom_seismometer.js', importName: 'createOceanBottomSeismometer' },
  { id: 'root_nodule', name: 'Nitrogen Fixing Root Nodule', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/root_nodule_symbiosis.js', importName: 'createRootNoduleSymbiosis' },
  { id: 'pitcher_plant', name: 'Pitcher Plant Digestion', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/pitcher_plant_trap.js', importName: 'createPitcherPlantTrap' },
  { id: 'flower_repro', name: 'Angiosperm Reproduction', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/flower_reproduction.js', importName: 'createFlowerReproduction' },
  { id: 'animal_cell_zoo', name: 'Animal Cell', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/animal_cell.js', importName: 'createAnimalCell' },
  { id: 'mammalian_heart', name: 'Mammalian Heart', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/mammalian_heart.js', importName: 'createMammalianHeart' },
  { id: 'frog_anatomy', name: 'Frog Anatomy', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/frog_anatomy.js', importName: 'createFrogAnatomy' },
  { id: 'avian_wing', name: 'Avian Wing Structure', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/avian_wing_structure.js', importName: 'createAvianWingStructure' },
  { id: 'spider_anatomy', name: 'Spider Anatomy', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/spider_anatomy.js', importName: 'createSpiderAnatomy' },
  { id: 'bacteriophage', name: 'Bacteriophage T4', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/bacteriophage.js', importName: 'createBacteriophage' },
  { id: 'influenza', name: 'Influenza Virus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/influenza.js', importName: 'createInfluenza' },
  { id: 'hiv_sub', name: 'Human Immunodeficiency Virus (HIV)', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/hiv.js', importName: 'createHIV' },
  { id: 'sars_cov_2', name: 'SARS-CoV-2', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/sars_cov_2.js', importName: 'createSarsCov2' },
  { id: 'ebola', name: 'Ebola Virus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/ebola.js', importName: 'createEbola' },
  { id: 'viral_transmission', name: 'Viral Transmission Network Simulator', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/viral-transmission-simulator.js', importName: 'createViralTransmissionSimulator' },
  { id: 'pathogen_mutation', name: 'Pathogen Mutation Sequencer', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/pathogen-mutation-sequencer.js', importName: 'createPathogenMutationSequencer' },
  { id: 'vaccine_cold_chain', name: 'Vaccine Cold Chain Delivery System', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/vaccine-cold-chain.js', importName: 'createVaccineColdChainDeliverySystem' },
  { id: 'outbreak_command', name: 'Outbreak Response Command Center', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/outbreak-command-center.js', importName: 'createOutbreakResponseCommandCenter' },
  { id: 'airborne_dispersion', name: 'Airborne Dispersion Chamber', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/airborne-dispersion-chamber.js', importName: 'createAirborneDispersionChamber' },
  { id: 'linac', name: 'Medical Linear Accelerator', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/linac_machine.js', importName: 'createMedicalLinearAccelerator' },
  { id: 'pet_ct', name: 'PET-CT Scanner', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/pet_ct_scanner.js', importName: 'createPETCTScanner' },
  { id: 'proton_therapy', name: 'Proton Therapy Cyclotron', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/proton_therapy_cyclotron.js', importName: 'createProtonTherapyCyclotron' },
  { id: 'brachytherapy', name: 'Brachytherapy Afterloader', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/brachytherapy_afterloader.js', importName: 'createBrachytherapyAfterloader' },
  { id: 'flow_cytometer', name: 'Clinical Flow Cytometer', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/clinical_flow_cytometer.js', importName: 'createClinicalFlowCytometer' },
  { id: 'animal_cell', name: 'Eukaryotic Animal Cell', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/animal_cell.js', importName: 'createAnimalCell' },
  { id: 'plant_cell', name: 'Eukaryotic Plant Cell', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/plant_cell.js', importName: 'createPlantCell' },
  { id: 'mitochondrion', name: 'Mitochondrial Structure', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/mitochondrion.js', importName: 'createMitochondrion' },
  { id: 'chloroplast', name: 'Chloroplast Structure', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/chloroplast.js', importName: 'createChloroplast' },
  { id: 'cell_membrane', name: 'Fluid Mosaic Cell Membrane', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cell_membrane.js', importName: 'createCellMembrane' },
  { id: 'compound_microscope', name: 'Compound Light Microscope', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/compound_light_microscope.js', importName: 'createCompoundLightMicroscope' },
  { id: 'rotary_microtome', name: 'Rotary Microtome', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/rotary_microtome.js', importName: 'createRotaryMicrotome' },
  { id: 'tissue_processor', name: 'Automated Tissue Processor', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/automated_tissue_processor.js', importName: 'createAutomatedTissueProcessor' },
  { id: 'cryostat', name: 'Cryostat', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/cryostat.js', importName: 'createCryostat' },
  { id: 'dna_rep', name: 'DNA Replication Fork', icon: '&#x2699;&#xFE0F;', category: 'molecular_biology', importPath: './machines/dna_replication_fork.js', importName: 'createDNAReplication' },
  { id: 'transcription', name: 'Transcription (mRNA Synthesis)', icon: '&#x2699;&#xFE0F;', category: 'molecular_biology', importPath: './machines/transcription_mrna_synthesis.js', importName: 'createTranscription' },
  { id: 'translation', name: 'Translation (Ribosome)', icon: '&#x2699;&#xFE0F;', category: 'molecular_biology', importPath: './machines/translation_ribosome_protein.js', importName: 'createTranslation' },
  { id: 'pcr', name: 'PCR Thermocycler', icon: '&#x2699;&#xFE0F;', category: 'molecular_biology', importPath: './machines/pcr_thermocycler.js', importName: 'createPCRThermocycler' },
  { id: 'gel_elec', name: 'Gel Electrophoresis', icon: '&#x2699;&#xFE0F;', category: 'molecular_biology', importPath: './machines/gel_electrophoresis.js', importName: 'createGelElectrophoresis' },
  { id: 'avian_lungs', name: 'Avian Respiratory System', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/avian_respiratory_system.js', importName: 'createAvianRespiratorySystem' },
  { id: 'bee_hive', name: 'Honey Bee Hive', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/honey_bee_hive_social.js', importName: 'createHoneyBeeHive' },
  { id: 'bat_sonar', name: 'Bat Echolocation', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/bat_echolocation_sonar.js', importName: 'createBatEcholocation' },
  { id: 'chameleon', name: 'Chameleon Tongue', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/chameleon_tongue_mechanism.js', importName: 'createChameleonTongue' },
  { id: 'spider_web', name: 'Spider Spinneret', icon: '&#x2699;&#xFE0F;', category: 'zoology', importPath: './machines/spider_web_spinneret.js', importName: 'createSpiderSpinneret' },
  { id: 'heart', name: 'Human Heart (Pumping)', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/human_heart_pumping.js', importName: 'createHumanHeart' },
  { id: 'lungs', name: 'Respiratory System', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/respiratory_system_lungs.js', importName: 'createRespiratorySystem' },
  { id: 'kidney', name: 'Kidney & Nephron', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/kidney_nephron_filtration.js', importName: 'createKidneyNephron' },
  { id: 'digestive', name: 'Digestive System', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/digestive_system_tract.js', importName: 'createDigestiveSystem' },
  { id: 'muscle', name: 'Skeletal Muscle Contraction', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/skeletal_muscle_contraction.js', importName: 'createSkeletalMuscle' },
  { id: 'hydroponics', name: 'Hydroponic Grow System', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/hydroponic_grow_system.js', importName: 'createHydroponicGrowSystem' },
  { id: 'seed_germination', name: 'Seed Germination Process', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/seed_germination_process.js', importName: 'createSeedGerminationProcess' },
  { id: 'tree_tissues', name: 'Tree Xylem & Phloem', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/tree_xylem_phloem.js', importName: 'createTreeXylemPhloem' },
  { id: 'volcano', name: 'Stratovolcano & Caldera', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/volcano_caldera.js', importName: 'createVolcanoCaldera' },
  { id: 'tectonic_plates', name: 'Subduction Zone', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/tectonic_plate_boundary.js', importName: 'createTectonicPlateBoundary' },
  { id: 'oil_rig', name: 'Offshore Drilling Rig', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/oil_drilling_rig.js', importName: 'createOilDrillingRig' },
  { id: 'quantum_computer', name: 'Dilution Refrigerator QPU', icon: '&#x2699;&#xFE0F;', category: 'quantum_physics', importPath: './machines/quantum_computer_dilution_refrigerator.js', importName: 'createQuantumComputer' },
  { id: 'stern_gerlach', name: 'Stern-Gerlach Experiment', icon: '&#x2699;&#xFE0F;', category: 'quantum_physics', importPath: './machines/stern_gerlach_experiment.js', importName: 'createSternGerlachExperiment' },
  { id: 'double_slit', name: 'Double Slit Interferometer', icon: '&#x2699;&#xFE0F;', category: 'quantum_physics', importPath: './machines/double_slit_interferometer.js', importName: 'createDoubleSlitInterferometer' },
  { id: 'particle_detector', name: 'Particle Accelerator Detector', icon: '&#x2699;&#xFE0F;', category: 'quantum_physics', importPath: './machines/particle_accelerator_detector.js', importName: 'createParticleAcceleratorDetector' },
  { id: 'schrodinger_cat', name: 'Schrodinger\'s Cat', icon: '&#x2699;&#xFE0F;', category: 'quantum_physics', importPath: './machines/schrodinger_cat_box_conceptual.js', importName: 'createSchrodingerCat' },
  { id: 'deep_sea_submersible', name: 'Deep Sea Submersible', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/deep_sea_submersible.js', importName: 'createSubmersible' },
  { id: 'ocean_current_turbine', name: 'Tidal Current Turbine', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_current_turbine.js', importName: 'createOceanCurrentTurbine' },
  { id: 'coral_reef_ecosystem', name: 'Coral Reef Ecosystem', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/coral_reef_ecosystem.js', importName: 'createCoralReefEcosystem' },
  { id: 'sonar_mapping_ship', name: 'Multibeam Sonar Ship', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/sonar_mapping_ship.js', importName: 'createSonarMappingShip' },
  { id: 'carbon_nanotube_assembler', name: 'Carbon Nanotube Assembler', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/carbon_nanotube_assembler.js', importName: 'createCarbonNanotubeAssembler' },
  { id: 'nanoscale_molecular_motor', name: 'Nanoscale Molecular Motor', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanoscale_molecular_motor.js', importName: 'createNanoscaleMolecularMotor' },
  { id: 'targeted_drug_delivery_nanobot', name: 'Targeted Drug Delivery Nanobot', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/targeted_drug_delivery_nanobot.js', importName: 'createTargetedDrugDeliveryNanobot' },
  { id: 'solar_system_orrery', name: 'Solar System Orrery', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/solar_system_orrery.js', importName: 'createSolarSystemOrrery' },
  { id: 'pulsar_star', name: 'Pulsar Star', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/pulsar_star.js', importName: 'createPulsarStar' },
  { id: 'dyson_sphere', name: 'Dyson Sphere', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/dyson_sphere.js', importName: 'createDysonSphere' },
  { id: 'james_webb_telescope', name: 'James Webb Space Telescope', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/james_webb_telescope.js', importName: 'createJamesWebbTelescope' },
  { id: 'tornado_vortex', name: 'Tornado Vortex', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/tornado_vortex.js', importName: 'createTornadoVortex' },
  { id: 'hurricane_eye', name: 'Hurricane Eye Wall', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/hurricane_eye.js', importName: 'createHurricaneEye' },
  { id: 'doppler_radar', name: 'Doppler Weather Radar', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'weather_balloon', name: 'Radiosonde Weather Balloon', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/weather_balloon.js', importName: 'createWeatherBalloon' },
  { id: 'barometric_pressure_system', name: 'Barometric Pressure System', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/barometric_pressure_system.js', importName: 'createBarometricPressureSystem' },
  { id: 'penicillin_molecule', name: 'Penicillin Molecule', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/penicillin_molecule.js', importName: 'createPenicillinMolecule' },
  { id: 'mrna_vaccine_lipid_nanoparticle', name: 'mRNA Vaccine LNP', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/mrna_vaccine_lipid_nanoparticle.js', importName: 'createMRNAVaccineLNP' },
  { id: 'tablet_compression_machine', name: 'Tablet Compression Machine', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/tablet_compression_machine.js', importName: 'createTabletCompressionMachine' },
  { id: 'pill_coating_drum', name: 'Pill Coating Drum', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pill_coating_drum.js', importName: 'createPillCoatingDrum' },
  { id: 'protein_kinase_inhibitor', name: 'Protein Kinase Inhibitor', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/protein_kinase_inhibitor.js', importName: 'createProteinKinaseInhibitor' },
  { id: 'engine', name: '4-Cylinder Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/engine.js', importName: 'createEngine' },
  { id: 'motor', name: 'Electric Motor', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/motor.js', importName: 'createMotor' },
  { id: 'fan', name: 'Ceiling Fan', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/fan.js', importName: 'createFan' },
  { id: 'clock', name: 'Mechanical Clock', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/clock.js', importName: 'createClock' },
  { id: 'gears', name: 'Gear Train', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/gears.js', importName: 'createGears' },
  { id: 'ac', name: 'Air Conditioner', icon: '&#x2699;&#xFE0F;', category: 'thermal', importPath: './machines/ac.js', importName: 'createAC' },
  { id: 'refrigerator', name: 'Refrigerator', icon: '&#x2699;&#xFE0F;', category: 'thermal', importPath: './machines/refrigerator.js', importName: 'createRefrigerator' },
  { id: 'tap', name: 'Water Tap', icon: '&#x2699;&#xFE0F;', category: 'thermal', importPath: './machines/tap.js', importName: 'createTap' },
  { id: 'rocket', name: 'Rocket Engine', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/rocket.js', importName: 'createRocket' },
  { id: 'battery', name: 'Lead-Acid Battery', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/battery.js', importName: 'createBattery' },
  { id: 'charger', name: 'Phone Charger', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/charger.js', importName: 'createCharger' },
  { id: 'v8engine', name: 'V8 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/v8engine.js', importName: 'createV8Engine' },
  { id: 'v12engine', name: 'V12 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/v12engine.js', importName: 'createV12Engine' },
  { id: 'inline6', name: 'Inline-6 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/inline6.js', importName: 'createInline6Engine' },
  { id: 'boxer', name: 'Boxer Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/boxer.js', importName: 'createBoxerEngine' },
  { id: 'v6engine', name: 'V6 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/v6engine.js', importName: 'createV6Engine' },
  { id: 'v10engine', name: 'V10 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/v10engine.js', importName: 'createV10Engine' },
  { id: 'w12engine', name: 'W12 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/w12engine.js', importName: 'createW12Engine' },
  { id: 'w16engine', name: 'W16 Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/w16engine.js', importName: 'createW16Engine' },
  { id: 'transmission', name: 'Transmission', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/transmission.js', importName: 'createTransmission' },
  { id: 'diesel', name: 'Diesel Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/diesel.js', importName: 'createDieselEngine' },
  { id: 'hybrid', name: 'Hybrid Powertrain', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/hybrid.js', importName: 'createHybrid' },
  { id: 'carburetor', name: 'Carburetor', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/carburetor.js', importName: 'createCarburetor' },
  { id: 'cpu', name: 'CPU Architecture', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/cpu_architecture.js', importName: 'createCPU' },
  { id: 'gpu', name: 'GPU Architecture', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/gpu.js', importName: 'createGPU' },
  { id: 'motherboard', name: 'Motherboard', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/motherboard.js', importName: 'createMotherboard' },
  { id: 'fighterjet', name: 'Fighter Jet', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/fighterjet.js', importName: 'createFighterJet' },
  { id: 'helicopter', name: 'Helicopter', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/helicopter.js', importName: 'createHelicopter' },
  { id: 'laptop', name: 'Laptop Computer', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/laptop.js', importName: 'createLaptop' },
  { id: 'mobile', name: 'Mobile Phone', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/mobile.js', importName: 'createMobile' },
  { id: 'television', name: 'Television', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/television.js', importName: 'createTelevision' },
  { id: 'turbine', name: 'Gas Turbine (Jet)', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/turbine.js', importName: 'createTurbine' },
  { id: 'cnc', name: '5-Axis CNC', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/cnc_machine.js', importName: 'createCNCMachine' },
  { id: 'robotarm', name: 'Robotic Arm', icon: '&#x2699;&#xFE0F;', category: 'advanced', importPath: './machines/robot_arm.js', importName: 'createRobotArm' },
  { id: 'skeleton', name: 'Skeletal System', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_skeleton.js', importName: 'createAnatomySkeleton' },
  { id: 'cardio', name: 'Cardiovascular System', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_cardiovascular.js', importName: 'createCardiovascular' },
  { id: 'nervous', name: 'Nervous System', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_nervous.js', importName: 'createNervous' },
  { id: 'organs', name: 'Internal Organs', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_organs.js', importName: 'createOrgans' },
  { id: 'cell', name: 'Cell Biology', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/cell_biology.js', importName: 'createCell' },
  { id: 'cell5', name: 'Cell Biology (Phase 5)', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/cell_phase5.js', importName: 'createCellPhase5' },

  // --- Geology ---
  { id: 'subduction_zone', name: 'Tectonic Subduction Zone', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/subduction_zone.js', importName: 'createSubductionZone' },
  { id: 'tectonic_boundary', name: 'Tectonic Plate Boundary', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/tectonic_plate_boundary.js', importName: 'createTectonicPlateBoundary' },
  { id: 'geyser_system', name: 'Geyser System', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/geyser_system.js', importName: 'createGeyserSystem' },
  { id: 'earthquake_fault', name: 'Earthquake Fault Line', icon: '&#x2699;&#xFE0F;', category: 'geology', importPath: './machines/earthquake_fault_line.js', importName: 'createEarthquakeFault' },

  // --- Robotics ---
  { id: 'articulated_robot_arm', name: 'Articulated Robot Arm', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/articulated_robot_arm.js', importName: 'createArticulatedRobotArm' },
  { id: 'autonomous_mobile_robot', name: 'Autonomous Mobile Robot', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/autonomous_mobile_robot.js', importName: 'createAutonomousMobileRobot' },
  { id: 'hexapod_walker', name: 'Hexapod Walker', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/hexapod_walker.js', importName: 'createHexapodWalker' },
  { id: 'surgical_robot', name: 'Surgical Robot', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/surgical_robot.js', importName: 'createSurgicalRobot' },
  { id: 'humanoid_bipedal_robot', name: 'Humanoid Bipedal Robot', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/humanoid_bipedal_robot.js', importName: 'createHumanoidBipedalRobot' },

  // --- Thermodynamics ---
  { id: 'stirling_engine', name: 'Stirling Engine', icon: '&#x2699;&#xFE0F;', category: 'thermodynamics', importPath: './machines/stirling_engine.js', importName: 'createStirlingEngine' },
  { id: 'vapor_compression_refrigeration', name: 'Vapor Compression Refrigeration', icon: '&#x2699;&#xFE0F;', category: 'thermodynamics', importPath: './machines/vapor_compression_refrigeration.js', importName: 'createVaporCompressionRefrigeration' },
  { id: 'nuclear_reactor_core', name: 'Nuclear Reactor Core', icon: '&#x2699;&#xFE0F;', category: 'thermodynamics', importPath: './machines/nuclear_reactor.js', importName: 'createNuclearReactor' },
  { id: 'gas_turbine_jet_engine', name: 'Gas Turbine Jet Engine', icon: '&#x2699;&#xFE0F;', category: 'thermodynamics', importPath: './machines/jet_engine.js', importName: 'createJetEngine' },
  { id: 'geothermal_heat_pump', name: 'Geothermal Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'thermodynamics', importPath: './machines/geothermal_heat_pump.js', importName: 'createGeothermalHeatPump' },

  // --- Optics ---
  { id: 'michelson_interferometer', name: 'Michelson Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/michelson_interferometer.js', importName: 'createMichelsonInterferometer' },
  { id: 'confocal_microscope', name: 'Confocal Microscope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/confocal_microscope.js', importName: 'createConfocalMicroscope' },
  { id: 'nd_yag_laser', name: 'Nd:YAG Laser', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/nd_yag_laser.js', importName: 'createNdYagLaser' },
  { id: 'holographic_setup', name: 'Holographic Setup', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/holographic_setup.js', importName: 'createHolographicSetup' },
  { id: 'optical_fiber_link', name: 'Optical Fiber Link', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optical_fiber_link.js', importName: 'createOpticalFiberLink' },

  // --- Acoustics ---
  { id: 'tuning_fork', name: 'Tuning Fork', icon: '&#x2699;&#xFE0F;', category: 'acoustics', importPath: './machines/tuning_fork.js', importName: 'createTuningFork' },
  { id: 'speaker_cone', name: 'Speaker Cone', icon: '&#x2699;&#xFE0F;', category: 'acoustics', importPath: './machines/speaker_cone.js', importName: 'createSpeakerCone' },
  { id: 'anechoic_chamber', name: 'Anechoic Chamber', icon: '&#x2699;&#xFE0F;', category: 'acoustics', importPath: './machines/anechoic_chamber.js', importName: 'createAnechoicChamber' },
  { id: 'sonar_array', name: 'Submarine Sonar Array', icon: '&#x2699;&#xFE0F;', category: 'acoustics', importPath: './machines/sonar_array.js', importName: 'createSonarArray' },

  // --- Environmental ---
  { id: 'air_quality_station', name: 'Air Quality Monitoring Station', icon: '&#x2699;&#xFE0F;', category: 'environmental', importPath: './machines/air_quality_station.js', importName: 'createAirQualityStation' },
  { id: 'desalination_plant', name: 'Reverse Osmosis Desalination Plant', icon: '&#x2699;&#xFE0F;', category: 'environmental', importPath: './machines/desalination_plant.js', importName: 'createDesalinationPlant' },
  { id: 'waste_bioreactor', name: 'Waste Composting Bioreactor', icon: '&#x2699;&#xFE0F;', category: 'environmental', importPath: './machines/waste_bioreactor.js', importName: 'createWasteBioreactor' },
  { id: 'solar_groundwater_pump', name: 'Solar Powered Groundwater Pump', icon: '&#x2699;&#xFE0F;', category: 'environmental', importPath: './machines/solar_groundwater_pump.js', importName: 'createSolarGroundwaterPump' },


  // --- Materials ---
  { id: 'scanning_electron_microscope', name: 'Scanning Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'materials', importPath: './machines/scanning_electron_microscope.js', importName: 'createScanningElectronMicroscope' },
  { id: 'tensile_testing_machine', name: 'Tensile Testing Machine', icon: '&#x2699;&#xFE0F;', category: 'materials', importPath: './machines/tensile_testing_machine.js', importName: 'createTensileTestingMachine' },
  { id: 'xray_diffractometer', name: 'X-Ray Diffractometer', icon: '&#x2699;&#xFE0F;', category: 'materials', importPath: './machines/xray_diffractometer.js', importName: 'createXRayDiffractometer' },
  { id: 'selective_laser_melting_printer', name: 'Selective Laser Melting Printer', icon: '&#x2699;&#xFE0F;', category: 'materials', importPath: './machines/selective_laser_melting_printer.js', importName: 'createSelectiveLaserMeltingPrinter' },
  { id: 'cvd_reactor', name: 'CVD Reactor', icon: '&#x2699;&#xFE0F;', category: 'materials', importPath: './machines/cvd_reactor.js', importName: 'createCVDReactor' },

  // --- Quantum ---
  { id: 'double_slit_quantum', name: 'Quantum Double Slit', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/double_slit_quantum.js', importName: 'createDoubleSlitQuantum' },
  { id: 'cyclotron', name: 'Cyclotron Particle Accelerator', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/cyclotron.js', importName: 'createCyclotron' },
  { id: 'quantum_entanglement', name: 'Quantum Entanglement Generator', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_entanglement.js', importName: 'createQuantumEntanglement' },

  // --- Civil ---
  { id: 'suspension_bridge', name: 'Suspension Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/suspension_bridge.js', importName: 'createSuspensionBridge' },
  { id: 'hydroelectric_dam', name: 'Hydroelectric Dam', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/hydroelectric_dam.js', importName: 'createHydroelectricDam' },
  { id: 'tunnel_boring_machine', name: 'Tunnel Boring Machine', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/tunnel_boring_machine.js', importName: 'createTunnelBoringMachine' },
  { id: 'skyscraper_tuned_mass_damper', name: 'Tuned Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/tuned_mass_damper.js', importName: 'createTunedMassDamper' },
  { id: 'arch_bridge', name: 'Arch Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/arch_bridge.js', importName: 'createArchBridge' },

  // --- Marine ---
  { id: 'submarine_propulsion', name: 'Nuclear Submarine Propulsion', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/submarine_propulsion.js', importName: 'createSubmarinePropulsion' },
  { id: 'dynamic_positioning', name: 'Dynamic Positioning System', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/dynamic_positioning.js', importName: 'createDynamicPositioning' },
  { id: 'marine_desalination_plant', name: 'Marine Desalination Plant', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/desalination_plant.js', importName: 'createDesalinationPlant' },
  { id: 'ship_stabilizer', name: 'Active Fin Stabilizer', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/ship_stabilizer.js', importName: 'createShipStabilizer' },
  { id: 'marine_diesel_engine', name: 'Two-Stroke Marine Diesel Engine', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_diesel_engine.js', importName: 'createMarineDieselEngine' },

  // --- Aerospace ---
  { id: 'turbofan_jet_engine', name: 'Turbofan Jet Engine', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/jet_engine.js', importName: 'createJetEngine' },
  { id: 'space_shuttle', name: 'Space Shuttle Orbiter', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_shuttle.js', importName: 'createSpaceShuttle' },
  { id: 'satellite', name: 'Communications Satellite', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/satellite.js', importName: 'createSatellite' },

  // --- Petrochemical ---
  { id: 'fractional_distillation_column', name: 'Fractional Distillation Column', icon: '&#x2699;&#xFE0F;', category: 'petrochemical', importPath: './machines/fractional_distillation_column.js', importName: 'createFractionalDistillationColumn' },
  { id: 'fluid_catalytic_cracker', name: 'Fluid Catalytic Cracker', icon: '&#x2699;&#xFE0F;', category: 'petrochemical', importPath: './machines/fluid_catalytic_cracker.js', importName: 'createFluidCatalyticCracker' },
  { id: 'steam_cracking_furnace', name: 'Steam Cracking Furnace', icon: '&#x2699;&#xFE0F;', category: 'petrochemical', importPath: './machines/steam_cracking_furnace.js', importName: 'createSteamCrackingFurnace' },
  { id: 'ammonia_synthesis_reactor', name: 'Ammonia Synthesis Reactor', icon: '&#x2699;&#xFE0F;', category: 'petrochemical', importPath: './machines/ammonia_synthesis_reactor.js', importName: 'createAmmoniaSynthesisReactor' },
  { id: 'hydrodesulfurization_unit', name: 'Hydrodesulfurization Unit', icon: '&#x2699;&#xFE0F;', category: 'petrochemical', importPath: './machines/hydrodesulfurization_unit.js', importName: 'createHydrodesulfurizationUnit' },

  // --- Anatomy ---
  { id: 'human_heart', name: 'Human Heart', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/human_heart_pumping.js', importName: 'createHumanHeart' },
  { id: 'human_eye', name: 'Human Eye', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/human_eye.js', importName: 'createHumanEye' },
  { id: 'brain_and_neurons', name: 'Brain and Neurons', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/brain_and_neurons.js', importName: 'createBrainAndNeurons' },
  { id: 'human_ear', name: 'Human Ear', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/human_ear.js', importName: 'createHumanEar' },
  { id: 'respiratory_system', name: 'Respiratory System', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/respiratory_system_lungs.js', importName: 'createRespiratorySystem' },

  // --- Botany ---
  { id: 'chloroplast_structure', name: 'Chloroplast Structure', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/chloroplast_structure.js', importName: 'createChloroplastStructure' },
  { id: 'plant_cell_anatomy', name: 'Plant Cell Anatomy', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/plant_cell_anatomy.js', importName: 'createPlantCellAnatomy' },
  { id: 'stomata_transpiration', name: 'Stomata Transpiration', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/stomata_transpiration.js', importName: 'createStomataTranspiration' },
  { id: 'root_nodule_symbiosis', name: 'Root Nodule Symbiosis', icon: '&#x2699;&#xFE0F;', category: 'botany', importPath: './machines/root_nodule_symbiosis.js', importName: 'createRootNoduleSymbiosis' },

  { id: 'acid_base_titration', name: 'Acid Base Titration', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/acid_base_titration.js', importName: 'createAcidBaseTitration' },
  { id: 'acoustics_doppler_effect', name: 'Acoustics Doppler Effect', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustics_doppler_effect.js', importName: 'createAcousticsDopplerEffect' },
  { id: 'acoustics_helmholtz_resonator', name: 'Acoustics Helmholtz Resonator', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustics_helmholtz_resonator.js', importName: 'createAcousticsHelmholtzResonator' },
  { id: 'acoustics_interference_pattern', name: 'Acoustics Interference Pattern', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustics_interference_pattern.js', importName: 'createAcousticsInterferencePattern' },
  { id: 'acoustics_resonance_chamber', name: 'Acoustics Resonance Chamber', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustics_resonance_chamber.js', importName: 'createAcousticsResonanceChamber' },
  { id: 'acoustics_wave_propagation', name: 'Acoustics Wave Propagation', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustics_wave_propagation.js', importName: 'createAcousticsWavePropagation' },
  { id: 'acoustic_levitation_chamber', name: 'Acoustic Levitation Chamber', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustic_levitation_chamber.js', importName: 'createAcousticLevitationChamber' },
  { id: 'acoustic_tractor_beam', name: 'Acoustic Tractor Beam', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/acoustic_tractor_beam.js', importName: 'createAcousticTractorBeam' },
  { id: 'aero_cooling_edge', name: 'Aero Cooling Edge', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_cooling_edge.js', importName: 'createActiveCoolingEdge' },
  { id: 'aero_plasma_emitter', name: 'Aero Plasma Emitter', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_plasma_emitter.js', importName: 'createPlasmaEmitter' },
  { id: 'aero_scramjet_intake', name: 'Aero Scramjet Intake', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_scramjet_intake.js', importName: 'createScramjetIntake' },
  { id: 'aero_waverider_hull', name: 'Aero Waverider Hull', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_waverider_hull.js', importName: 'createWaveriderHull' },
  { id: 'aero_wind_tunnel', name: 'Aero Wind Tunnel', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aero_wind_tunnel.js', importName: 'createWindTunnel' },
  { id: 'aircraft_carrier', name: 'Aircraft Carrier', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/aircraft_carrier.js', importName: 'createAircraftCarrier' },
  { id: 'alu_datapath', name: 'Alu Datapath', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/alu_datapath.js', importName: 'createAluDatapath' },
  { id: 'apollo_lunar_lander', name: 'Apollo Lunar Lander', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/apollo_lunar_lander.js', importName: 'createApolloLunarLander' },
  { id: 'arch_dam', name: 'Arch Dam', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/arch_dam.js', importName: 'createArchDam' },
  { id: 'asteroid_anchor_dock', name: 'Asteroid Anchor Dock', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/asteroid_anchor_dock.js', importName: 'createAsteroidAnchorDock' },
  { id: 'asteroid_mining_rig', name: 'Asteroid Mining Rig', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/asteroid_mining_rig.js', importName: 'createAsteroidMiningRig' },
  { id: 'astro_pulsar_timing_array_dish', name: 'Astro Pulsar Timing Array Dish', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/astro_pulsar_timing_array_dish.js', importName: 'createPulsarTimingArrayDish' },
  { id: 'atmos_cloud_seeding_swarm', name: 'Atmos Cloud Seeding Swarm', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atmos_cloud_seeding_swarm.js', importName: 'createCloudSeedingSwarm' },
  { id: 'atmos_ionospheric_heater', name: 'Atmos Ionospheric Heater', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atmos_ionospheric_heater.js', importName: 'createIonosphericHeaterArray' },
  { id: 'atmos_ozone_replenisher', name: 'Atmos Ozone Replenisher', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atmos_ozone_replenisher.js', importName: 'createOzoneReplenisher' },
  { id: 'atmos_tornado_dissipation_array', name: 'Atmos Tornado Dissipation Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atmos_tornado_dissipation_array.js', importName: 'createTornadoDissipationArray' },
  { id: 'atmos_water_generator', name: 'Atmos Water Generator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atmos_water_generator.js', importName: 'createAtmosphericWaterGenerator' },
  { id: 'atomic_clock_array', name: 'Atomic Clock Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atomic_clock_array.js', importName: 'createAtomicClockArray' },
  { id: 'atoms', name: 'Atoms', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/atoms.js', importName: 'createAtoms' },
  { id: 'audio_amplifier', name: 'Audio Amplifier', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/audio_amplifier.js', importName: 'createAmplifier' },
  { id: 'audio_microphone', name: 'Audio Microphone', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/audio_microphone.js', importName: 'createMicrophone' },
  { id: 'automated_weather_station', name: 'Automated Weather Station', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/automated_weather_station.js', importName: 'createAutomatedWeatherStation' },
  { id: 'autonomous_underwater_vehicle', name: 'Autonomous Underwater Vehicle', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/autonomous_underwater_vehicle.js', importName: 'createAutonomousUnderwaterVehicle' },
  { id: 'auv_explorer', name: 'Auv Explorer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/auv_explorer.js', importName: 'createAuvExplorer' },
  { id: 'bacteriophage_virus', name: 'Bacteriophage Virus', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/bacteriophage_virus.js', importName: 'createBacteriophageVirus' },
  { id: 'base_isolated_building', name: 'Base Isolated Building', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/base_isolated_building.js', importName: 'createBaseIsolatedBuilding' },
  { id: 'base_isolation_system', name: 'Base Isolation System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/base_isolation_system.js', importName: 'createBaseIsolationSystem' },
  { id: 'bci_eeg_headset', name: 'Bci Eeg Headset', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/bci_eeg_headset.js', importName: 'createEEGHeadset' },
  { id: 'bci_meg_helmet', name: 'Bci Meg Helmet', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/bci_meg_helmet.js', importName: 'createMEGHelmet' },
  { id: 'bci_nirs_array', name: 'Bci Nirs Array', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/bci_nirs_array.js', importName: 'createNIRSArray' },
  { id: 'bci_tms', name: 'Bci Tms', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/bci_tms.js', importName: 'createTMS' },
  { id: 'bci_ultrasound', name: 'Bci Ultrasound', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/bci_ultrasound.js', importName: 'createFocusedUltrasound' },
  { id: 'blackHoleAccretionDisk', name: 'BlackHoleAccretionDisk', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/blackHoleAccretionDisk.js', importName: 'createBlackHoleAccretionDisk' },
  { id: 'black_hole_accretion', name: 'Black Hole Accretion', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/black_hole_accretion.js', importName: 'createBlackHoleAccretion' },
  { id: 'bldc_motor', name: 'Bldc Motor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/bldc_motor.js', importName: 'createBLDCMotor' },
  { id: 'blowout_preventer', name: 'Blowout Preventer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/blowout_preventer.js', importName: 'createBlowoutPreventer' },
  { id: 'bose_einstein_condensate', name: 'Bose Einstein Condensate', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/bose_einstein_condensate.js', importName: 'createBoseEinsteinCondensate' },
  { id: 'brain', name: 'Brain', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/brain.js', importName: 'createBrain' },
  { id: 'cable_stayed_bridge', name: 'Cable Stayed Bridge', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cable_stayed_bridge.js', importName: 'createCableStayedBridge' },
  { id: 'cathode_ray_tube', name: 'Cathode Ray Tube', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cathode_ray_tube.js', importName: 'createCathodeRayTube' },
  { id: 'centrifugal_separator', name: 'Centrifugal Separator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/centrifugal_separator.js', importName: 'createCentrifugalSeparator' },
  { id: 'chloroplast_photosynthesis', name: 'Chloroplast Photosynthesis', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/chloroplast_photosynthesis.js', importName: 'createChloroplastPhotosynthesis' },
  { id: 'civil_concrete_mixer', name: 'Civil Concrete Mixer', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_concrete_mixer.js', importName: 'createConcreteBatchingPlantMixer' },
  { id: 'civil_tbm_cutterhead', name: 'Civil Tbm Cutterhead', icon: '&#x2699;&#xFE0F;', category: 'civil_engineering', importPath: './machines/civil_tbm_cutterhead.js', importName: 'createTunnelBoringMachine' },
  { id: 'climate_carbon_capture_tower', name: 'Climate Carbon Capture Tower', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/climate_carbon_capture_tower.js', importName: 'createCarbonCaptureTower' },
  { id: 'climate_glacial_preserver', name: 'Climate Glacial Preserver', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/climate_glacial_preserver.js', importName: 'createGlacialPreserver' },
  { id: 'climate_ocean_alkalinity_vessel', name: 'Climate Ocean Alkalinity Vessel', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/climate_ocean_alkalinity_vessel.js', importName: 'createOceanAlkalinityVessel' },
  { id: 'climate_solar_reflector_array', name: 'Climate Solar Reflector Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/climate_solar_reflector_array.js', importName: 'createSolarReflectorArray' },
  { id: 'climate_stratospheric_aerosol_jet', name: 'Climate Stratospheric Aerosol Jet', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/climate_stratospheric_aerosol_jet.js', importName: 'createStratosphericAerosolJet' },
  { id: 'climatology_doppler_radar', name: 'Climatology Doppler Radar', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/climatology_doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'clockwork_mechanism', name: 'Clockwork Mechanism', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/clockwork_mechanism.js', importName: 'createClockworkMechanism' },
  { id: 'combustion_engine', name: 'Combustion Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/combustion_engine.js', importName: 'createCombustionEngine' },
  { id: 'computer_architecture_cpu_pipeline', name: 'Computer Architecture Cpu Pipeline', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/computer_architecture_cpu_pipeline.js', importName: 'createCpuPipeline' },
  { id: 'concrete_frame', name: 'Concrete Frame', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/concrete_frame.js', importName: 'createConcreteFrame' },
  { id: 'cpu_pipeline', name: 'Cpu Pipeline', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cpu_pipeline.js', importName: 'createCpuPipeline' },
  { id: 'crispr_cas9_complex', name: 'Crispr Cas9 Complex', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/crispr_cas9_complex.js', importName: 'createCrisprCas9Complex' },
  { id: 'cryptography_blockchain_ledger', name: 'Cryptography Blockchain Ledger', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cryptography_blockchain_ledger.js', importName: 'createBlockchainLedger' },
  { id: 'cstr_reactor', name: 'Cstr Reactor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cstr_reactor.js', importName: 'createCSTRReactor' },
  { id: 'cyber_air_gapped_vault', name: 'Cyber Air Gapped Vault', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_air_gapped_vault.js', importName: 'createAirGappedVault' },
  { id: 'cyber_biometric_hardware_token', name: 'Cyber Biometric Hardware Token', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_biometric_hardware_token.js', importName: 'createBiometricHardwareToken' },
  { id: 'cyber_bionic_retinal_implant', name: 'Cyber Bionic Retinal Implant', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_bionic_retinal_implant.js', importName: 'createBionicRetinalImplant' },
  { id: 'cyber_cochlear_micro_array', name: 'Cyber Cochlear Micro Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_cochlear_micro_array.js', importName: 'createCochlearMicroArray' },
  { id: 'cyber_exoskeleton_joint', name: 'Cyber Exoskeleton Joint', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_exoskeleton_joint.js', importName: 'createExoskeletonJoint' },
  { id: 'cyber_intrusion_detection_rack', name: 'Cyber Intrusion Detection Rack', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_intrusion_detection_rack.js', importName: 'createIntrusionDetectionRack' },
  { id: 'cyber_myoelectric_prosthetic_arm', name: 'Cyber Myoelectric Prosthetic Arm', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_myoelectric_prosthetic_arm.js', importName: 'createMyoelectricProstheticArm' },
  { id: 'cyber_neural_lace_mesh', name: 'Cyber Neural Lace Mesh', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/cyber_neural_lace_mesh.js', importName: 'createNeuralLaceMesh' },
  { id: 'cyber_puf_chip', name: 'Cyber Puf Chip', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_puf_chip.js', importName: 'createPUFChip' },
  { id: 'cyber_quantum_key_cryptoprocessor', name: 'Cyber Quantum Key Cryptoprocessor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyber_quantum_key_cryptoprocessor.js', importName: 'createQuantumKeyCryptoprocessor' },
  { id: 'cyclotron_accelerator', name: 'Cyclotron Accelerator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/cyclotron_accelerator.js', importName: 'createCyclotronAccelerator' },
  { id: 'deep_ocean_buoy', name: 'Deep Ocean Buoy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/deep_ocean_buoy.js', importName: 'createDeepOceanBuoy' },
  { id: 'deep_sea_rig', name: 'Deep Sea Rig', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/deep_sea_rig.js', importName: 'createDeepSeaRig' },
  { id: 'digestive_system', name: 'Digestive System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/digestive_system.js', importName: 'createDigestiveSystem' },
  { id: 'dna_molecule', name: 'Dna Molecule', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/dna_molecule.js', importName: 'createDNAMolecule' },
  { id: 'dna_origami_fabricator', name: 'Dna Origami Fabricator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/dna_origami_fabricator.js', importName: 'createDnaOrigamiFabricator' },
  { id: 'doppler_weather_radar', name: 'Doppler Weather Radar', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/doppler_weather_radar.js', importName: 'createDopplerWeatherRadar' },
  { id: 'dyson_swarm_mirror', name: 'Dyson Swarm Mirror', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/dyson_swarm_mirror.js', importName: 'createDysonSwarmMirror' },
  { id: 'earthquake_base_isolator', name: 'Earthquake Base Isolator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/earthquake_base_isolator.js', importName: 'createEarthquakeBaseIsolator' },
  { id: 'electric_motor', name: 'Electric Motor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/electric_motor.js', importName: 'createElectricMotor' },
  { id: 'electromagnetic_relay', name: 'Electromagnetic Relay', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/electromagnetic_relay.js', importName: 'createElectromagneticRelay' },
  { id: 'energy_flow_battery', name: 'Energy Flow Battery', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/energy_flow_battery.js', importName: 'createFlowBattery' },
  { id: 'energy_flywheel', name: 'Energy Flywheel', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/energy_flywheel.js', importName: 'createFlywheelVault' },
  { id: 'energy_sand_battery', name: 'Energy Sand Battery', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/energy_sand_battery.js', importName: 'createSandBattery' },
  { id: 'energy_smes', name: 'Energy Smes', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/energy_smes.js', importName: 'createSMES' },
  { id: 'energy_solid_state_battery', name: 'Energy Solid State Battery', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/energy_solid_state_battery.js', importName: 'createSolidStateBattery' },
  { id: 'enso_system', name: 'Enso System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/enso_system.js', importName: 'createEnsoSystem' },
  { id: 'entangled_photon_rangefinder', name: 'Entangled Photon Rangefinder', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/entangled_photon_rangefinder.js', importName: 'createEntangledPhotonRangefinder' },
  { id: 'exotic_alcubierre_drive', name: 'Exotic Alcubierre Drive', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/exotic_alcubierre_drive.js', importName: 'createAlcubierreDrive' },
  { id: 'exotic_antimatter_rocket', name: 'Exotic Antimatter Rocket', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/exotic_antimatter_rocket.js', importName: 'createAntimatterRocket' },
  { id: 'exotic_em_drive_resonator', name: 'Exotic Em Drive Resonator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/exotic_em_drive_resonator.js', importName: 'createEMDriveResonator' },
  { id: 'exotic_nuclear_salt_water_rocket', name: 'Exotic Nuclear Salt Water Rocket', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/exotic_nuclear_salt_water_rocket.js', importName: 'createNuclearSaltWaterRocket' },
  { id: 'exotic_photonic_laser_thruster', name: 'Exotic Photonic Laser Thruster', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/exotic_photonic_laser_thruster.js', importName: 'createPhotonicLaserThruster' },
  { id: 'farm_aeroponic_chamber', name: 'Farm Aeroponic Chamber', icon: '&#x2699;&#xFE0F;', category: 'vertical_farming', importPath: './machines/farm_aeroponic_chamber.js', importName: 'createAeroponicChamber' },
  { id: 'farm_harvester_drone', name: 'Farm Harvester Drone', icon: '&#x2699;&#xFE0F;', category: 'vertical_farming', importPath: './machines/farm_harvester_drone.js', importName: 'createHarvesterDrone' },
  { id: 'farm_hydroponic_doser', name: 'Farm Hydroponic Doser', icon: '&#x2699;&#xFE0F;', category: 'vertical_farming', importPath: './machines/farm_hydroponic_doser.js', importName: 'createHydroponicDoser' },
  { id: 'farm_led_array', name: 'Farm Led Array', icon: '&#x2699;&#xFE0F;', category: 'vertical_farming', importPath: './machines/farm_led_array.js', importName: 'createLEDArray' },
  { id: 'farm_microbiome_analyzer', name: 'Farm Microbiome Analyzer', icon: '&#x2699;&#xFE0F;', category: 'vertical_farming', importPath: './machines/farm_microbiome_analyzer.js', importName: 'createMicrobiomeAnalyzer' },
  { id: 'fiber_optic_router', name: 'Fiber Optic Router', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fiber_optic_router.js', importName: 'createFiberOpticRouter' },
  { id: 'flagellum', name: 'Flagellum', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/flagellum.js', importName: 'createFlagellum' },
  { id: 'flower_pollination', name: 'Flower Pollination', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/flower_pollination.js', importName: 'createFlowerPollination' },
  { id: 'fluidized_bed_reactor', name: 'Fluidized Bed Reactor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fluidized_bed_reactor.js', importName: 'createFluidizedBedReactor' },
  { id: 'fossil_excavation_site', name: 'Fossil Excavation Site', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fossil_excavation_site.js', importName: 'createFossilExcavationSite' },
  { id: 'foucault_pendulum', name: 'Foucault Pendulum', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/foucault_pendulum.js', importName: 'createFoucaultPendulum' },
  { id: 'four_bar_linkage', name: 'Four Bar Linkage', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/four_bar_linkage.js', importName: 'createFourBarLinkage' },
  { id: 'fuel_cell', name: 'Fuel Cell', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fuel_cell.js', importName: 'createFuelCell' },
  { id: 'fusion_rocket_engine', name: 'Fusion Rocket Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fusion_rocket_engine.js', importName: 'createFusionRocketEngine' },
  { id: 'gas_turbine_jet_engine', name: 'Gas Turbine Jet Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/gas_turbine_jet_engine.js', importName: 'createGasTurbineJetEngine' },
  { id: 'gel_electrophoresis_chamber', name: 'Gel Electrophoresis Chamber', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/gel_electrophoresis_chamber.js', importName: 'createGelElectrophoresisChamber' },
  { id: 'genetics_base_editor_protein', name: 'Genetics Base Editor Protein', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/genetics_base_editor_protein.js', importName: 'createBaseEditorProtein' },
  { id: 'genetics_cas12a_system', name: 'Genetics Cas12a System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/genetics_cas12a_system.js', importName: 'createCas12aSystem' },
  { id: 'genetics_crispr', name: 'Genetics Crispr', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/genetics_crispr.js', importName: 'createCrisprCas9' },
  { id: 'genetics_gene_drive_mechanism', name: 'Genetics Gene Drive Mechanism', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/genetics_gene_drive_mechanism.js', importName: 'createGeneDriveMechanism' },
  { id: 'genetics_prime_editing_complex', name: 'Genetics Prime Editing Complex', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/genetics_prime_editing_complex.js', importName: 'createPrimeEditingComplex' },
  { id: 'genetics_synthetic_chromosome_assembler', name: 'Genetics Synthetic Chromosome Assembler', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/genetics_synthetic_chromosome_assembler.js', importName: 'createSyntheticChromosomeAssembler' },
  { id: 'geophysics_magma_engine', name: 'Geophysics Magma Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geophysics_magma_engine.js', importName: 'createMagmaEngine' },
  { id: 'geophysics_magma_tap', name: 'Geophysics Magma Tap', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geophysics_magma_tap.js', importName: 'createMagmaTap' },
  { id: 'geophysics_mantle_sensor', name: 'Geophysics Mantle Sensor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geophysics_mantle_sensor.js', importName: 'createMantleSensorArray' },
  { id: 'geophysics_moho_drill', name: 'Geophysics Moho Drill', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geophysics_moho_drill.js', importName: 'createMohoDrill' },
  { id: 'geophysics_tectonic_monitor', name: 'Geophysics Tectonic Monitor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geophysics_tectonic_monitor.js', importName: 'createTectonicMonitor' },
  { id: 'geothermal_power_plant', name: 'Geothermal Power Plant', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geothermal_power_plant.js', importName: 'createGeothermalPowerPlant' },
  { id: 'geo_core_extractor', name: 'Geo Core Extractor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geo_core_extractor.js', importName: 'createIronNickelCoreExtractor' },
  { id: 'geo_diamond_anvil_cell', name: 'Geo Diamond Anvil Cell', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geo_diamond_anvil_cell.js', importName: 'createHighPressureDiamondAnvilCell' },
  { id: 'geo_magma_sonar_drone', name: 'Geo Magma Sonar Drone', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geo_magma_sonar_drone.js', importName: 'createMagmaOceanSonarDrone' },
  { id: 'geo_mantle_drill', name: 'Geo Mantle Drill', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geo_mantle_drill.js', importName: 'createCoreSamplingMantleDrill' },
  { id: 'geo_seismic_sensor', name: 'Geo Seismic Sensor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/geo_seismic_sensor.js', importName: 'createSeismicTomographySensor' },
  { id: 'gpcr_signaling', name: 'Gpcr Signaling', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/gpcr_signaling.js', importName: 'createGPCRSignalingPathway' },
  { id: 'gps_satellite', name: 'Gps Satellite', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/gps_satellite.js', importName: 'createGpsSatellite' },
  { id: 'graphene_sheet_synthesizer', name: 'Graphene Sheet Synthesizer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/graphene_sheet_synthesizer.js', importName: 'createGrapheneSheetSynthesizer' },
  { id: 'graphics_card', name: 'Graphics Card', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/graphics_card.js', importName: 'createGraphicsCard' },
  { id: 'gravitationalWaveInterferometer', name: 'GravitationalWaveInterferometer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/gravitationalWaveInterferometer.js', importName: 'createGravitationalWaveInterferometer' },
  { id: 'greenhouse_effect', name: 'Greenhouse Effect', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/greenhouse_effect.js', importName: 'createGreenhouseEffect' },
  { id: 'haber_bosch_reactor', name: 'Haber Bosch Reactor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/haber_bosch_reactor.js', importName: 'createHaberBoschReactor' },
  { id: 'helicopterRotor', name: 'HelicopterRotor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/helicopterRotor.js', importName: 'createHelicopterRotorSystem' },
  { id: 'helicopter_rotor', name: 'Helicopter Rotor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/helicopter_rotor.js', importName: 'createHelicopterRotor' },
  { id: 'holo_acousto_optic_deflector', name: 'Holo Acousto Optic Deflector', icon: '&#x2699;&#xFE0F;', category: 'holographics', importPath: './machines/holo_acousto_optic_deflector.js', importName: 'createAcoustoOpticDeflector' },
  { id: 'holo_data_storage_crystal', name: 'Holo Data Storage Crystal', icon: '&#x2699;&#xFE0F;', category: 'holographics', importPath: './machines/holo_data_storage_crystal.js', importName: 'createHolographicDataStorageCrystal' },
  { id: 'holo_light_field_volumetric_display', name: 'Holo Light Field Volumetric Display', icon: '&#x2699;&#xFE0F;', category: 'holographics', importPath: './machines/holo_light_field_volumetric_display.js', importName: 'createLightFieldVolumetricDisplay' },
  { id: 'holo_optical_tweezers', name: 'Holo Optical Tweezers', icon: '&#x2699;&#xFE0F;', category: 'holographics', importPath: './machines/holo_optical_tweezers.js', importName: 'createHolographicOpticalTweezers' },
  { id: 'holo_spatial_light_modulator', name: 'Holo Spatial Light Modulator', icon: '&#x2699;&#xFE0F;', category: 'holographics', importPath: './machines/holo_spatial_light_modulator.js', importName: 'createSpatialLightModulator' },
  { id: 'hplc_system', name: 'Hplc System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hplc_system.js', importName: 'createHPLCSystem' },
  { id: 'hubble_telescope', name: 'Hubble Telescope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hubble_telescope.js', importName: 'createHubbleTelescope' },
  { id: 'human_brain', name: 'Human Brain', icon: '&#x2699;&#xFE0F;', category: 'bci_engineering', importPath: './machines/human_brain.js', importName: 'createHumanBrain' },
  { id: 'human_heart', name: 'Human Heart', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/human_heart.js', importName: 'createHumanHeart' },
  { id: 'human_lungs', name: 'Human Lungs', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/human_lungs.js', importName: 'createHumanLungs' },
  { id: 'hurricane_formation', name: 'Hurricane Formation', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hurricane_formation.js', importName: 'createHurricaneFormation' },
  { id: 'hurricane_hunter_aircraft', name: 'Hurricane Hunter Aircraft', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hurricane_hunter_aircraft.js', importName: 'createHurricaneHunterAircraft' },
  { id: 'hydraulic_excavator', name: 'Hydraulic Excavator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hydraulic_excavator.js', importName: 'createHydraulicExcavator' },
  { id: 'hydroelectric_turbine', name: 'Hydroelectric Turbine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hydroelectric_turbine.js', importName: 'createHydroelectricTurbine' },
  { id: 'hydrothermal_vent_observatory', name: 'Hydrothermal Vent Observatory', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hydrothermal_vent_observatory.js', importName: 'createHydrothermalVentObservatory' },
  { id: 'hydrothermal_vent_system', name: 'Hydrothermal Vent System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hydrothermal_vent_system.js', importName: 'createHydrothermalVentSystem' },
  { id: 'ice_albedo_feedback', name: 'Ice Albedo Feedback', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ice_albedo_feedback.js', importName: 'createIceAlbedoFeedback' },
  { id: 'ice_core_driller', name: 'Ice Core Driller', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ice_core_driller.js', importName: 'createGlacialIceCoreDriller' },
  { id: 'infrasonic_crowd_control_emitter', name: 'Infrasonic Crowd Control Emitter', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/infrasonic_crowd_control_emitter.js', importName: 'createInfrasonicCrowdControlEmitter' },
  { id: 'inner_ear', name: 'Inner Ear', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/inner_ear.js', importName: 'createInnerEar' },
  { id: 'inorganic_carbon_nanotube', name: 'Inorganic Carbon Nanotube', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/inorganic_carbon_nanotube.js', importName: 'createCarbonNanotube' },
  { id: 'internal_combustion_engine', name: 'Internal Combustion Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/internal_combustion_engine.js', importName: 'createInternalCombustionEngine' },
  { id: 'ion_thruster_drive', name: 'Ion Thruster Drive', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ion_thruster_drive.js', importName: 'createIonThrusterDrive' },
  { id: 'iss_space_station', name: 'Iss Space Station', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/iss_space_station.js', importName: 'createISSSpaceStation' },
  { id: 'iss_station', name: 'Iss Station', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/iss_station.js', importName: 'createIssStation' },
  { id: 'jwst_observatory', name: 'Jwst Observatory', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/jwst_observatory.js', importName: 'createJwstObservatory' },
  { id: 'kidney', name: 'Kidney', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/kidney.js', importName: 'createKidney' },
  { id: 'knee_joint', name: 'Knee Joint', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/knee_joint.js', importName: 'createKneeJoint' },
  { id: 'large_hadron_collider', name: 'Large Hadron Collider', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/large_hadron_collider.js', importName: 'createLHC' },
  { id: 'lhc_detector_slice', name: 'Lhc Detector Slice', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/lhc_detector_slice.js', importName: 'createLHCDetectorSlice' },
  { id: 'lhc_segment', name: 'Lhc Segment', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/lhc_segment.js', importName: 'createLHCSegment' },
  { id: 'lithium_ion_battery', name: 'Lithium Ion Battery', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/lithium_ion_battery.js', importName: 'createLithiumIonBattery' },
  { id: 'li_ion_battery', name: 'Li Ion Battery', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/li_ion_battery.js', importName: 'createLiIonBattery' },
  { id: 'macrophage_phagocytosis', name: 'Macrophage Phagocytosis', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/macrophage_phagocytosis.js', importName: 'createMacrophagePhagocytosis' },
  { id: 'magma_chamber_simulator', name: 'Magma Chamber Simulator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/magma_chamber_simulator.js', importName: 'createMagmaChamberSimulator' },
  { id: 'magneto_optical_trap', name: 'Magneto Optical Trap', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/magneto_optical_trap.js', importName: 'createMagnetoOpticalTrap' },
  { id: 'magnetron', name: 'Magnetron', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/magnetron.js', importName: 'createMagnetron' },
  { id: 'marine_biology_coral_reef', name: 'Marine Biology Coral Reef', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/marine_biology_coral_reef.js', importName: 'createCoralReef' },
  { id: 'marine_scrubber', name: 'Marine Scrubber', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/marine_scrubber.js', importName: 'createMarineScrubber' },
  { id: 'mars_rover_curiosity', name: 'Mars Rover Curiosity', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mars_rover_curiosity.js', importName: 'createMarsRoverCuriosity' },
  { id: 'mars_rover_perseverance', name: 'Mars Rover Perseverance', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mars_rover_perseverance.js', importName: 'createMarsRoverPerseverance' },
  { id: 'med_cryo_stasis_pod', name: 'Med Cryo Stasis Pod', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/med_cryo_stasis_pod.js', importName: 'createCryoStasisPod' },
  { id: 'med_da_vinci_console', name: 'Med Da Vinci Console', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/med_da_vinci_console.js', importName: 'createDaVinciConsole' },
  { id: 'med_micro_surgery_bot', name: 'Med Micro Surgery Bot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/med_micro_surgery_bot.js', importName: 'createMicroSurgeryBot' },
  { id: 'med_organ_regen_tank', name: 'Med Organ Regen Tank', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/med_organ_regen_tank.js', importName: 'createOrganRegenTank' },
  { id: 'med_plasma_scalpel', name: 'Med Plasma Scalpel', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/med_plasma_scalpel.js', importName: 'createPlasmaScalpel' },
  { id: 'metamaterials_acoustic_absorber', name: 'Metamaterials Acoustic Absorber', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/metamaterials_acoustic_absorber.js', importName: 'createAcousticAbsorber' },
  { id: 'meta_acoustic_cloak', name: 'Meta Acoustic Cloak', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/meta_acoustic_cloak.js', importName: 'createAcousticCloak' },
  { id: 'meta_negative_index_lens', name: 'Meta Negative Index Lens', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/meta_negative_index_lens.js', importName: 'createNegativeIndexLens' },
  { id: 'meta_programmable_matter', name: 'Meta Programmable Matter', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/meta_programmable_matter.js', importName: 'createProgrammableMatterCube' },
  { id: 'meta_seismic_shield', name: 'Meta Seismic Shield', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/meta_seismic_shield.js', importName: 'createSeismicShield' },
  { id: 'meta_thermal_cloak', name: 'Meta Thermal Cloak', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/meta_thermal_cloak.js', importName: 'createThermalCloak' },
  { id: 'microbiology_animal_cell', name: 'Microbiology Animal Cell', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/microbiology_animal_cell.js', importName: 'createAnimalCell' },
  { id: 'microfluidic_flow_cytometer', name: 'Microfluidic Flow Cytometer', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/microfluidic_flow_cytometer.js', importName: 'createFlowCytometer' },
  { id: 'microprocessor', name: 'Microprocessor', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/microprocessor.js', importName: 'createMicroprocessor' },
  { id: 'micro_droplet_generator_chip', name: 'Micro Droplet Generator Chip', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/micro_droplet_generator_chip.js', importName: 'createDropletGenerator' },
  { id: 'micro_electrowetting_dna_sequencer', name: 'Micro Electrowetting Dna Sequencer', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/micro_electrowetting_dna_sequencer.js', importName: 'createEWODSequencer' },
  { id: 'micro_organ_on_a_chip_incubator', name: 'Micro Organ On A Chip Incubator', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/micro_organ_on_a_chip_incubator.js', importName: 'createOrganOnAChip' },
  { id: 'micro_pcr_thermocycler_chip', name: 'Micro Pcr Thermocycler Chip', icon: '&#x2699;&#xFE0F;', category: 'microfluidics', importPath: './machines/micro_pcr_thermocycler_chip.js', importName: 'createPCRThermocycler' },
  { id: 'mining_asteroid_harpoon', name: 'Mining Asteroid Harpoon', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/mining_asteroid_harpoon.js', importName: 'createAsteroidHarpoon' },
  { id: 'mining_core_drilling_laser', name: 'Mining Core Drilling Laser', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mining_core_drilling_laser.js', importName: 'createCoreDrillingLaser' },
  { id: 'mining_optical_spectrometer', name: 'Mining Optical Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mining_optical_spectrometer.js', importName: 'createOpticalSpectrometer' },
  { id: 'mining_plasma_refiner', name: 'Mining Plasma Refiner', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mining_plasma_refiner.js', importName: 'createPlasmaRefiner' },
  { id: 'mining_slag_centrifuge', name: 'Mining Slag Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mining_slag_centrifuge.js', importName: 'createSlagCentrifuge' },
  { id: 'mrna_vaccine', name: 'Mrna Vaccine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mrna_vaccine.js', importName: 'createmRNAVaccineDelivery' },
  { id: 'nanomedicine_dna_origami_nanobot', name: 'Nanomedicine Dna Origami Nanobot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nanomedicine_dna_origami_nanobot.js', importName: 'createDnaOrigamiNanobot' },
  { id: 'nano_acoustic_tweezers', name: 'Nano Acoustic Tweezers', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/nano_acoustic_tweezers.js', importName: 'createAcousticTweezers' },
  { id: 'nano_dna_data_storage', name: 'Nano Dna Data Storage', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nano_dna_data_storage.js', importName: 'createDNADataStorageCrystal' },
  { id: 'networking_fiber_optic_cable', name: 'Networking Fiber Optic Cable', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/networking_fiber_optic_cable.js', importName: 'createFiberOpticCable' },
  { id: 'networking_satellite_dish', name: 'Networking Satellite Dish', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/networking_satellite_dish.js', importName: 'createSatelliteDish' },
  { id: 'neuron_cell', name: 'Neuron Cell', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuron_cell.js', importName: 'createNeuronCell' },
  { id: 'neuroscience_action_potential', name: 'Neuroscience Action Potential', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuroscience_action_potential.js', importName: 'createActionPotential' },
  { id: 'neuroscience_neuron_synapse', name: 'Neuroscience Neuron Synapse', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuroscience_neuron_synapse.js', importName: 'createNeuronSynapse' },
  { id: 'neuro_biomimetic_wing', name: 'Neuro Biomimetic Wing', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuro_biomimetic_wing.js', importName: 'createBiomimeticWing' },
  { id: 'neuro_eye_cluster', name: 'Neuro Eye Cluster', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuro_eye_cluster.js', importName: 'createEyeCluster' },
  { id: 'neuro_hexapod_walker', name: 'Neuro Hexapod Walker', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuro_hexapod_walker.js', importName: 'createHexapodWalker' },
  { id: 'neuro_synapse_controller', name: 'Neuro Synapse Controller', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuro_synapse_controller.js', importName: 'createSynapseController' },
  { id: 'neuro_vocal_cord_synth', name: 'Neuro Vocal Cord Synth', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuro_vocal_cord_synth.js', importName: 'createVocalCordSynth' },
  { id: 'nitrogen_cycle_soil', name: 'Nitrogen Cycle Soil', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nitrogen_cycle_soil.js', importName: 'createNitrogenCycleSoil' },
  { id: 'nmr_spectrometer', name: 'Nmr Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nmr_spectrometer.js', importName: 'createNMRSpectrometer' },
  { id: 'npn_transistor', name: 'Npn Transistor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/npn_transistor.js', importName: 'createNpnTransistor' },
  { id: 'nuclear_reactor_core', name: 'Nuclear Reactor Core', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nuclear_reactor_core.js', importName: 'createNuclearReactorCore' },
  { id: 'oceanic_abyssal_habitat', name: 'Oceanic Abyssal Habitat', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oceanic_abyssal_habitat.js', importName: 'createAbyssalHabitat' },
  { id: 'oceanic_benthic_drone_sub', name: 'Oceanic Benthic Drone Sub', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oceanic_benthic_drone_sub.js', importName: 'createBenthicDroneSub' },
  { id: 'oceanic_deep_ocean_tidal_turbine', name: 'Oceanic Deep Ocean Tidal Turbine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oceanic_deep_ocean_tidal_turbine.js', importName: 'createDeepOceanTidalTurbine' },
  { id: 'oceanic_hydrothermal_desalinator', name: 'Oceanic Hydrothermal Desalinator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oceanic_hydrothermal_desalinator.js', importName: 'createHydrothermalDesalinator' },
  { id: 'oceanic_thermal_vent_harvester', name: 'Oceanic Thermal Vent Harvester', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oceanic_thermal_vent_harvester.js', importName: 'createThermalVentHarvester' },
  { id: 'oceanographic_buoy', name: 'Oceanographic Buoy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oceanographic_buoy.js', importName: 'createOceanographicBuoy' },
  { id: 'ocean_conveyor_belt', name: 'Ocean Conveyor Belt', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ocean_conveyor_belt.js', importName: 'createOceanConveyorBelt' },
  { id: 'ocean_thermal_energy_conversion', name: 'Ocean Thermal Energy Conversion', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ocean_thermal_energy_conversion.js', importName: 'createOceanThermalEnergyConversion' },
  { id: 'offshore_wind_turbine', name: 'Offshore Wind Turbine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/offshore_wind_turbine.js', importName: 'createOffshoreWindTurbine' },
  { id: 'oncology_brachytherapy', name: 'Oncology Brachytherapy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oncology_brachytherapy.js', importName: 'createBrachytherapyAfterloader' },
  { id: 'oncology_pet_ct', name: 'Oncology Pet Ct', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oncology_pet_ct.js', importName: 'createPetCtScanner' },
  { id: 'oneill_cylinder_segment', name: 'Oneill Cylinder Segment', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/oneill_cylinder_segment.js', importName: 'createONeillCylinder' },
  { id: 'optics_electron_microscope', name: 'Optics Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/optics_electron_microscope.js', importName: 'createElectronMicroscope' },
  { id: 'optics_fiber_optic_network', name: 'Optics Fiber Optic Network', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/optics_fiber_optic_network.js', importName: 'createFiberOpticNetwork' },
  { id: 'orbitalResonanceSystem', name: 'OrbitalResonanceSystem', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/orbitalResonanceSystem.js', importName: 'createOrbitalResonanceSystem' },
  { id: 'orbital_centrifuge', name: 'Orbital Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/orbital_centrifuge.js', importName: 'createOrbitalCentrifuge' },
  { id: 'orbital_solar_power_satellite', name: 'Orbital Solar Power Satellite', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/orbital_solar_power_satellite.js', importName: 'createSolarPowerSatellite' },
  { id: 'pacemaker', name: 'Pacemaker', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pacemaker.js', importName: 'createPacemaker' },
  { id: 'penicillin_mechanism', name: 'Penicillin Mechanism', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/penicillin_mechanism.js', importName: 'createPenicillinMechanism' },
  { id: 'pharmacology_antibody_antigen', name: 'Pharmacology Antibody Antigen', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pharmacology_antibody_antigen.js', importName: 'createAntibodyAntigenModel' },
  { id: 'phloem_transport', name: 'Phloem Transport', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/phloem_transport.js', importName: 'createPhloemTransport' },
  { id: 'phononics_acoustic_metamaterial', name: 'Phononics Acoustic Metamaterial', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/phononics_acoustic_metamaterial.js', importName: 'createAcousticMetamaterial' },
  { id: 'photosynthesis_system', name: 'Photosynthesis System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/photosynthesis_system.js', importName: 'createPhotosynthesisSystem' },
  { id: 'phototropism_auxin', name: 'Phototropism Auxin', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/phototropism_auxin.js', importName: 'createPhototropismAuxin' },
  { id: 'physics_antimatter_bottle', name: 'Physics Antimatter Bottle', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_antimatter_bottle.js', importName: 'createAntimatterBottle' },
  { id: 'physics_antimatter_penning_trap', name: 'Physics Antimatter Penning Trap', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_antimatter_penning_trap.js', importName: 'createAntimatterPenningTrap' },
  { id: 'physics_calabi_yau_visualizer', name: 'Physics Calabi Yau Visualizer', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_calabi_yau_visualizer.js', importName: 'createCalabiYauVisualizer' },
  { id: 'physics_dark_matter_axion_haloscope', name: 'Physics Dark Matter Axion Haloscope', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_dark_matter_axion_haloscope.js', importName: 'createDarkMatterAxionHaloscope' },
  { id: 'physics_hawking_radiation_harvester', name: 'Physics Hawking Radiation Harvester', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_hawking_radiation_harvester.js', importName: 'createHawkingRadiationHarvester' },
  { id: 'physics_lhc_lead_ion_collider', name: 'Physics Lhc Lead Ion Collider', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_lhc_lead_ion_collider.js', importName: 'createLhcLeadIonCollider' },
  { id: 'physics_magnetic_monopole_trap', name: 'Physics Magnetic Monopole Trap', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_magnetic_monopole_trap.js', importName: 'createMagneticMonopoleTrap' },
  { id: 'physics_neutrino_ice_cube_string', name: 'Physics Neutrino Ice Cube String', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_neutrino_ice_cube_string.js', importName: 'createNeutrinoIceCubeString' },
  { id: 'physics_synchrotron_light_source', name: 'Physics Synchrotron Light Source', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_synchrotron_light_source.js', importName: 'createSynchrotronLightSource' },
  { id: 'physics_tachyon_observer', name: 'Physics Tachyon Observer', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/physics_tachyon_observer.js', importName: 'createTachyonObserver' },
  { id: 'pile_driving_rig', name: 'Pile Driving Rig', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pile_driving_rig.js', importName: 'createPileDrivingRig' },
  { id: 'plant_cell_mitosis', name: 'Plant Cell Mitosis', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plant_cell_mitosis.js', importName: 'createPlantCellMitosis' },
  { id: 'plant_cell_structure', name: 'Plant Cell Structure', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plant_cell_structure.js', importName: 'createPlantCellStructure' },
  { id: 'plasma_helicon_thruster', name: 'Plasma Helicon Thruster', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plasma_helicon_thruster.js', importName: 'createHeliconThruster' },
  { id: 'plasma_stellarator_coil', name: 'Plasma Stellarator Coil', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plasma_stellarator_coil.js', importName: 'createStellaratorCoil' },
  { id: 'plasma_tokamak_divertor', name: 'Plasma Tokamak Divertor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plasma_tokamak_divertor.js', importName: 'createTokamakDivertor' },
  { id: 'plasma_wakefield_accelerator', name: 'Plasma Wakefield Accelerator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plasma_wakefield_accelerator.js', importName: 'createWakefieldAccelerator' },
  { id: 'plasma_z_pinch', name: 'Plasma Z Pinch', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/plasma_z_pinch.js', importName: 'createZPinch' },
  { id: 'pn_junction_diode', name: 'Pn Junction Diode', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pn_junction_diode.js', importName: 'createPnJunctionDiode' },
  { id: 'polar_weather_satellite', name: 'Polar Weather Satellite', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/polar_weather_satellite.js', importName: 'createPolarWeatherSatellite' },
  { id: 'polymerization_extruder', name: 'Polymerization Extruder', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/polymerization_extruder.js', importName: 'createPolymerizationExtruder' },
  { id: 'propulsion_systems_ion_thruster', name: 'Propulsion Systems Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/propulsion_systems_ion_thruster.js', importName: 'createIonThruster' },
  { id: 'quantum_bb84_simulator', name: 'Quantum Bb84 Simulator', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_bb84_simulator.js', importName: 'createBB84Simulator' },
  { id: 'quantum_computer', name: 'Quantum Computer', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_computer.js', importName: 'createQuantumComputer' },
  { id: 'quantum_double_slit', name: 'Quantum Double Slit', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_double_slit.js', importName: 'createQuantumDoubleSlit' },
  { id: 'quantum_entangled_receiver', name: 'Quantum Entangled Receiver', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_entangled_receiver.js', importName: 'createEntangledPhotonReceiver' },
  { id: 'quantum_post_quantum_hsm', name: 'Quantum Post Quantum Hsm', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_post_quantum_hsm.js', importName: 'createPostQuantumHSM' },
  { id: 'quantum_qkd_transmitter', name: 'Quantum Qkd Transmitter', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_qkd_transmitter.js', importName: 'createQKDTransmitter' },
  { id: 'quantum_random_number_generator', name: 'Quantum Random Number Generator', icon: '&#x2699;&#xFE0F;', category: 'theoretical_physics', importPath: './machines/quantum_random_number_generator.js', importName: 'createQuantumRandomNumberGenerator' },
  { id: 'quant_compass_spin_sensor', name: 'Quant Compass Spin Sensor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/quant_compass_spin_sensor.js', importName: 'createQuantumCompass' },
  { id: 'quant_gravity_gradiometer', name: 'Quant Gravity Gradiometer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/quant_gravity_gradiometer.js', importName: 'createGravityGradiometer' },
  { id: 'qubit_processor_chip', name: 'Qubit Processor Chip', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/qubit_processor_chip.js', importName: 'createQubitProcessorChip' },
  { id: 'radiosonde_weather_balloon', name: 'Radiosonde Weather Balloon', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/radiosonde_weather_balloon.js', importName: 'createRadiosondeWeatherBalloon' },
  { id: 'radio_telescope', name: 'Radio Telescope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/radio_telescope.js', importName: 'createRadioTelescope' },
  { id: 'radio_telescope_array', name: 'Radio Telescope Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/radio_telescope_array.js', importName: 'createRadioTelescopeArray' },
  { id: 'relay_switch', name: 'Relay Switch', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/relay_switch.js', importName: 'createRelaySwitch' },
  { id: 'remotely_operated_vehicle', name: 'Remotely Operated Vehicle', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/remotely_operated_vehicle.js', importName: 'createRemotelyOperatedVehicle' },
  { id: 'robotics_hydrogel_deformable_bot', name: 'Robotics Hydrogel Deformable Bot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_hydrogel_deformable_bot.js', importName: 'createHydrogelDeformableBot' },
  { id: 'robotics_liquid_metal_actuator', name: 'Robotics Liquid Metal Actuator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_liquid_metal_actuator.js', importName: 'createLiquidMetalActuator' },
  { id: 'robotics_peristaltic_crawling_tube', name: 'Robotics Peristaltic Crawling Tube', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_peristaltic_crawling_tube.js', importName: 'createPeristalticCrawlingTube' },
  { id: 'robotics_pneumatic_tentacle', name: 'Robotics Pneumatic Tentacle', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_pneumatic_tentacle.js', importName: 'createPneumaticTentacle' },
  { id: 'robotics_silicone_muscle_array', name: 'Robotics Silicone Muscle Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_silicone_muscle_array.js', importName: 'createSiliconeMuscleArray' },
  { id: 'root_nodule_system', name: 'Root Nodule System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/root_nodule_system.js', importName: 'createRootNoduleSystem' },
  { id: 'root_osmosis', name: 'Root Osmosis', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/root_osmosis.js', importName: 'createRootOsmosis' },
  { id: 'rov_manipulator', name: 'Rov Manipulator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/rov_manipulator.js', importName: 'createRovManipulator' },
  { id: 'rov_trencher', name: 'Rov Trencher', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/rov_trencher.js', importName: 'createRovTrencher' },
  { id: 'satellite_uplink_station', name: 'Satellite Uplink Station', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/satellite_uplink_station.js', importName: 'createSatelliteUplinkStation' },
  { id: 'saturn_v_rocket', name: 'Saturn V Rocket', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/saturn_v_rocket.js', importName: 'createSaturnVRocket' },
  { id: 'scanning_tunneling_microscope', name: 'Scanning Tunneling Microscope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/scanning_tunneling_microscope.js', importName: 'createScanningTunnelingMicroscope' },
  { id: 'seed_germination', name: 'Seed Germination', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/seed_germination.js', importName: 'createSeedGermination' },
  { id: 'seismic_monitoring_network', name: 'Seismic Monitoring Network', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/seismic_monitoring_network.js', importName: 'createSeismicMonitoringNetwork' },
  { id: 'seismograph_station', name: 'Seismograph Station', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/seismograph_station.js', importName: 'createSeismographStation' },
  { id: 'seismology_seismograph', name: 'Seismology Seismograph', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/seismology_seismograph.js', importName: 'createSeismograph' },
  { id: 'seismology_tsunami_buoy', name: 'Seismology Tsunami Buoy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/seismology_tsunami_buoy.js', importName: 'createTsunamiBuoy' },
  { id: 'shark_anatomy', name: 'Shark Anatomy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/shark_anatomy.js', importName: 'createSharkAnatomy' },
  { id: 'shield_volcano_effusive_flow', name: 'Shield Volcano Effusive Flow', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/shield_volcano_effusive_flow.js', importName: 'createShieldVolcanoEffusiveFlow' },
  { id: 'skeleton_arm', name: 'Skeleton Arm', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/skeleton_arm.js', importName: 'createSkeletonArm' },
  { id: 'skyscraper_tuned_mass_damper', name: 'Skyscraper Tuned Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/skyscraper_tuned_mass_damper.js', importName: 'createTunedMassDamper' },
  { id: 'sls_rocket', name: 'Sls Rocket', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/sls_rocket.js', importName: 'createSlsRocket' },
  { id: 'smart_electrochromic_glass', name: 'Smart Electrochromic Glass', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_electrochromic_glass.js', importName: 'createElectrochromicGlass' },
  { id: 'smart_magnetorheological_damper', name: 'Smart Magnetorheological Damper', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_magnetorheological_damper.js', importName: 'createMagnetorheologicalDamper' },
  { id: 'smart_self_healing_polymer', name: 'Smart Self Healing Polymer', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_self_healing_polymer.js', importName: 'createSelfHealingPolymer' },
  { id: 'smart_shape_memory_actuator', name: 'Smart Shape Memory Actuator', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_shape_memory_actuator.js', importName: 'createShapeMemoryActuator' },
  { id: 'smart_triboelectric_nanogenerator', name: 'Smart Triboelectric Nanogenerator', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_triboelectric_nanogenerator.js', importName: 'createTriboelectricNanogenerator' },
  { id: 'solarFlareMagneticReconnection', name: 'SolarFlareMagneticReconnection', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/solarFlareMagneticReconnection.js', importName: 'createSolarFlareMagneticReconnection' },
  { id: 'solar_panel', name: 'Solar Panel', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/solar_panel.js', importName: 'createSolarPanel' },
  { id: 'solar_sail_probe', name: 'Solar Sail Probe', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/solar_sail_probe.js', importName: 'createSolarSailProbe' },
  { id: 'sonic_fire_extinguisher', name: 'Sonic Fire Extinguisher', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/sonic_fire_extinguisher.js', importName: 'createSonicFireExtinguisher' },
  { id: 'sonochemistry_acoustic_levitator', name: 'Sonochemistry Acoustic Levitator', icon: '&#x2699;&#xFE0F;', category: 'acoustic_engineering', importPath: './machines/sonochemistry_acoustic_levitator.js', importName: 'createAcousticLevitator' },
  { id: 'space_elevator_tether', name: 'Space Elevator Tether', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_elevator_tether.js', importName: 'createSpaceElevator' },
  { id: 'space_helium3_extraction_plant', name: 'Space Helium3 Extraction Plant', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_helium3_extraction_plant.js', importName: 'createHelium3ExtractionPlant' },
  { id: 'space_low_gravity_centrifuge', name: 'Space Low Gravity Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_low_gravity_centrifuge.js', importName: 'createLowGravityCentrifuge' },
  { id: 'space_lunar_3d_printer', name: 'Space Lunar 3d Printer', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_lunar_3d_printer.js', importName: 'createLunar3DPrinter' },
  { id: 'space_lunar_lava_tube_airlock', name: 'Space Lunar Lava Tube Airlock', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_lunar_lava_tube_airlock.js', importName: 'createLunarLavaTubeAirlock' },
  { id: 'space_moon_dust_scrubber', name: 'Space Moon Dust Scrubber', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/space_moon_dust_scrubber.js', importName: 'createMoonDustScrubber' },
  { id: 'squeezed_light_interferometer', name: 'Squeezed Light Interferometer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/squeezed_light_interferometer.js', importName: 'createSqueezedLightInterferometer' },
  { id: 'ssri_synapse', name: 'Ssri Synapse', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ssri_synapse.js', importName: 'createSSRIMechanism' },
  { id: 'steam_engine', name: 'Steam Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/steam_engine.js', importName: 'createSteamEngine' },
  { id: 'steam_locomotive', name: 'Steam Locomotive', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/steam_locomotive.js', importName: 'createSteamLocomotive' },
  { id: 'steam_turbine', name: 'Steam Turbine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/steam_turbine.js', importName: 'createSteamTurbine' },
  { id: 'step_down_transformer', name: 'Step Down Transformer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/step_down_transformer.js', importName: 'createStepDownTransformer' },
  { id: 'stern_gerlach', name: 'Stern Gerlach', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/stern_gerlach.js', importName: 'createSternGerlach' },
  { id: 'stern_gerlach_apparatus', name: 'Stern Gerlach Apparatus', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/stern_gerlach_apparatus.js', importName: 'createSternGerlachApparatus' },
  { id: 'stomach', name: 'Stomach', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/stomach.js', importName: 'createStomach' },
  { id: 'stomata_guard_cells', name: 'Stomata Guard Cells', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/stomata_guard_cells.js', importName: 'createStomataGuardCells' },
  { id: 'stratovolcano_eruption_model', name: 'Stratovolcano Eruption Model', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/stratovolcano_eruption_model.js', importName: 'createStratovolcanoEruptionModel' },
  { id: 'subatomic_baryogenesis_reactor', name: 'Subatomic Baryogenesis Reactor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/subatomic_baryogenesis_reactor.js', importName: 'createBaryogenesisReactor' },
  { id: 'subatomic_higgs_field_modulator', name: 'Subatomic Higgs Field Modulator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/subatomic_higgs_field_modulator.js', importName: 'createHiggsFieldModulator' },
  { id: 'subatomic_muon_catalyzed_fusion_core', name: 'Subatomic Muon Catalyzed Fusion Core', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/subatomic_muon_catalyzed_fusion_core.js', importName: 'createMuonCatalyzedFusionCore' },
  { id: 'subatomic_neutrino_oscillation', name: 'Subatomic Neutrino Oscillation', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/subatomic_neutrino_oscillation.js', importName: 'createNeutrinoOscillation' },
  { id: 'subatomic_pion_beam_emitter', name: 'Subatomic Pion Beam Emitter', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/subatomic_pion_beam_emitter.js', importName: 'createPionBeamEmitter' },
  { id: 'subatomic_quark_gluon_chamber', name: 'Subatomic Quark Gluon Chamber', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/subatomic_quark_gluon_chamber.js', importName: 'createQuarkGluonChamber' },
  { id: 'submarine_cable_repeater', name: 'Submarine Cable Repeater', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/submarine_cable_repeater.js', importName: 'createSubmarineCableRepeater' },
  { id: 'submersible_rov', name: 'Submersible Rov', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/submersible_rov.js', importName: 'createSubmersibleROV' },
  { id: 'supersonicWing', name: 'SupersonicWing', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/supersonicWing.js', importName: 'createSupersonicDeltaWing' },
  { id: 'taphonomy_amber_entombment', name: 'Taphonomy Amber Entombment', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/taphonomy_amber_entombment.js', importName: 'createAmberEntombment' },
  { id: 'taphonomy_decay_stages', name: 'Taphonomy Decay Stages', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/taphonomy_decay_stages.js', importName: 'createDecayStages' },
  { id: 'taphonomy_fossilization', name: 'Taphonomy Fossilization', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/taphonomy_fossilization.js', importName: 'createFossilization' },
  { id: 'taphonomy_scavenging', name: 'Taphonomy Scavenging', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/taphonomy_scavenging.js', importName: 'createScavenging' },
  { id: 'taphonomy_sediment_compaction', name: 'Taphonomy Sediment Compaction', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/taphonomy_sediment_compaction.js', importName: 'createSedimentCompaction' },
  { id: 'terra_atmospheric_processor', name: 'Terra Atmospheric Processor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/terra_atmospheric_processor.js', importName: 'createAtmosphereProcessor' },
  { id: 'terra_comet_tractor', name: 'Terra Comet Tractor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/terra_comet_tractor.js', importName: 'createCometTractor' },
  { id: 'terra_cyanobacteria_seeder', name: 'Terra Cyanobacteria Seeder', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/terra_cyanobacteria_seeder.js', importName: 'createCyanobacteriaSeederDrone' },
  { id: 'terra_martian_soil_detoxifier', name: 'Terra Martian Soil Detoxifier', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/terra_martian_soil_detoxifier.js', importName: 'createMartianSoilDetoxifier' },
  { id: 'terra_subglacial_ocean_probe', name: 'Terra Subglacial Ocean Probe', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/terra_subglacial_ocean_probe.js', importName: 'createSubglacialOceanProbe' },
  { id: 'tidal_energy_generator', name: 'Tidal Energy Generator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/tidal_energy_generator.js', importName: 'createTidalEnergyGenerator' },
  { id: 'tokamak_reactor', name: 'Tokamak Reactor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/tokamak_reactor.js', importName: 'createTokamakReactor' },
  { id: 'transmission_electron_microscope', name: 'Transmission Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/transmission_electron_microscope.js', importName: 'createTransmissionElectronMicroscope' },
  { id: 'trilobite_anatomy', name: 'Trilobite Anatomy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/trilobite_anatomy.js', importName: 'createTrilobiteAnatomy' },
  { id: 'tsunami_warning_buoy', name: 'Tsunami Warning Buoy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/tsunami_warning_buoy.js', importName: 'createTsunamiWarningBuoy' },
  { id: 'turbocharger', name: 'Turbocharger', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/turbocharger.js', importName: 'createTurbocharger' },
  { id: 'turbofanEngine', name: 'TurbofanEngine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/turbofanEngine.js', importName: 'createTurbofanJetEngine' },
  { id: 'turbofan_engine', name: 'Turbofan Engine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/turbofan_engine.js', importName: 'createTurbofanEngine' },
  { id: 'ultrasonic_cell_disruptor', name: 'Ultrasonic Cell Disruptor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ultrasonic_cell_disruptor.js', importName: 'createUltrasonicCellDisruptor' },
  { id: 'variablePitchPropeller', name: 'VariablePitchPropeller', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/variablePitchPropeller.js', importName: 'createVariablePitchPropeller' },
  { id: 'ventilator', name: 'Ventilator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ventilator.js', importName: 'createVentilator' },
  { id: 'venus_flytrap_mechanism', name: 'Venus Flytrap Mechanism', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/venus_flytrap_mechanism.js', importName: 'createVenusFlytrapMechanism' },
  { id: 'viral_vector_delivery', name: 'Viral Vector Delivery', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/viral_vector_delivery.js', importName: 'createViralVectorDelivery' },
  { id: 'virology_ebola', name: 'Virology Ebola', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/virology_ebola.js', importName: 'createEbola' },
  { id: 'virology_hiv', name: 'Virology Hiv', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/virology_hiv.js', importName: 'createHIV' },
  { id: 'virus_bacteriophage', name: 'Virus Bacteriophage', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/virus_bacteriophage.js', importName: 'createBacteriophage' },
  { id: 'voyager_probe', name: 'Voyager Probe', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/voyager_probe.js', importName: 'createVoyagerProbe' },
  { id: 'water_molecule', name: 'Water Molecule', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/water_molecule.js', importName: 'createWaterMolecule' },
  { id: 'water_treatment_plant', name: 'Water Treatment Plant', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/water_treatment_plant.js', importName: 'createWaterTreatmentPlant' },
  { id: 'weapon_directed_energy_turret', name: 'Weapon Directed Energy Turret', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/weapon_directed_energy_turret.js', importName: 'createDirectedEnergyTurret' },
  { id: 'weapon_emp_disruptor_cannon', name: 'Weapon Emp Disruptor Cannon', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/weapon_emp_disruptor_cannon.js', importName: 'createEMPDisruptorCannon' },
  { id: 'weapon_graviton_torpedo_launcher', name: 'Weapon Graviton Torpedo Launcher', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/weapon_graviton_torpedo_launcher.js', importName: 'createGravitonTorpedoLauncher' },
  { id: 'weapon_plasma_railgun', name: 'Weapon Plasma Railgun', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/weapon_plasma_railgun.js', importName: 'createPlasmaRailgun' },
  { id: 'weapon_tachyon_lance', name: 'Weapon Tachyon Lance', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/weapon_tachyon_lance.js', importName: 'createTachyonLance' },
  { id: 'windTunnel', name: 'WindTunnel', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/windTunnel.js', importName: 'createSubsonicWindTunnel' },
  { id: 'xylem_transpiration', name: 'Xylem Transpiration', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/xylem_transpiration.js', importName: 'createXylemTranspiration' },
  { id: 'acoustic_cloaking_device', name: 'Acoustic Cloaking Device', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/acoustic_cloaking_device.js', importName: 'createAcousticCloakingDevice' },
  { id: 'acoustic_holographic_emitter', name: 'Acoustic Holographic Emitter', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/acoustic_holographic_emitter.js', importName: 'createAcousticHolographicEmitter' },
  { id: 'ac_generator', name: 'Generator', icon: '&#x2699;&#xFE0F;', category: 'ac', importPath: './machines/ac_generator.js', importName: 'createAcGenerator' },
  { id: 'aerodynamics_airfoil_lift', name: 'Airfoil Lift', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_airfoil_lift.js', importName: 'createAirfoilLift' },
  { id: 'aerodynamics_magnus_effect', name: 'Magnus Effect', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_magnus_effect.js', importName: 'createMagnusEffect' },
  { id: 'aerodynamics_propeller_thrust', name: 'Propeller Thrust', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_propeller_thrust.js', importName: 'createPropellerThrust' },
  { id: 'aerodynamics_shock_wave', name: 'Shock Wave', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_shock_wave.js', importName: 'createShockWave' },
  { id: 'aerodynamics_wind_tunnel', name: 'Wind Tunnel', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_wind_tunnel.js', importName: 'createWindTunnel' },
  { id: 'aero_bow_thruster', name: 'Bow Thruster', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_bow_thruster.js', importName: 'createShipBowThruster' },
  { id: 'aero_flap_track', name: 'Flap Track', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_flap_track.js', importName: 'createAirplaneFlapTrack' },
  { id: 'aero_gyroscopic_horizon', name: 'Gyroscopic Horizon', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_gyroscopic_horizon.js', importName: 'createGyroscopicHorizon' },
  { id: 'aero_helicopter_swashplate', name: 'Helicopter Swashplate', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_helicopter_swashplate.js', importName: 'createHelicopterSwashplate' },
  { id: 'aero_hovercraft_lift_fan', name: 'Hovercraft Lift Fan', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_hovercraft_lift_fan.js', importName: 'createLiftFan' },
  { id: 'aero_hydrofoil_strut', name: 'Hydrofoil Strut', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_hydrofoil_strut.js', importName: 'createHydrofoilStrut' },
  { id: 'aero_jet_stator_vane', name: 'Jet Stator Vane', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_jet_stator_vane.js', importName: 'createStatorVane' },
  { id: 'aero_pelton_wheel', name: 'Pelton Wheel', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_pelton_wheel.js', importName: 'createPeltonWheel' },
  { id: 'aero_pitot_tube', name: 'Pitot Tube', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_pitot_tube.js', importName: 'createAircraftPitotTube' },
  { id: 'aero_retracting_landing_gear', name: 'Retracting Landing Gear', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_retracting_landing_gear.js', importName: 'createRetractingLandingGear' },
  { id: 'aero_submarine_ballast', name: 'Submarine Ballast', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_submarine_ballast.js', importName: 'createBallastTank' },
  { id: 'aero_tail_rotor', name: 'Tail Rotor', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_tail_rotor.js', importName: 'createHelicopterTailRotor' },
  { id: 'aero_thrust_reverser', name: 'Thrust Reverser', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_thrust_reverser.js', importName: 'createThrustReverser' },
  { id: 'aero_variable_pitch_propeller', name: 'Variable Pitch Propeller', icon: '&#x2699;&#xFE0F;', category: 'aero', importPath: './machines/aero_variable_pitch_propeller.js', importName: 'createVariablePitchPropeller' },
  { id: 'aes_cipher_engine', name: 'Cipher Engine', icon: '&#x2699;&#xFE0F;', category: 'aes', importPath: './machines/aes_cipher_engine.js', importName: 'createAESCipherEngine' },
  { id: 'agricultural_automated_robotic_seeder', name: 'Automated Robotic Seeder', icon: '&#x2699;&#xFE0F;', category: 'agricultural', importPath: './machines/agricultural_automated_robotic_seeder.js', importName: 'createAutomatedRoboticSeeder' },
  { id: 'agricultural_center_pivot_irrigation_system', name: 'Center Pivot Irrigation System', icon: '&#x2699;&#xFE0F;', category: 'agricultural', importPath: './machines/agricultural_center_pivot_irrigation_system.js', importName: 'createCenterPivotIrrigationSystem' },
  { id: 'agricultural_combine_harvester', name: 'Combine Harvester', icon: '&#x2699;&#xFE0F;', category: 'agricultural', importPath: './machines/agricultural_combine_harvester.js', importName: 'createCombineHarvester' },
  { id: 'agricultural_robotic_milking_machine', name: 'Robotic Milking Machine', icon: '&#x2699;&#xFE0F;', category: 'agricultural', importPath: './machines/agricultural_robotic_milking_machine.js', importName: 'createRoboticMilkingMachine' },
  { id: 'agricultural_tractor', name: 'Tractor', icon: '&#x2699;&#xFE0F;', category: 'agricultural', importPath: './machines/agricultural_tractor.js', importName: 'createAgriculturalTractor' },
  { id: 'agronomy_autonomous_tractor', name: 'Autonomous Tractor', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_autonomous_tractor.js', importName: 'createAutonomousTractor' },
  { id: 'agronomy_drone_sprayer', name: 'Drone Sprayer', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_drone_sprayer.js', importName: 'createDroneSprayer' },
  { id: 'agronomy_hydroponic_tower', name: 'Hydroponic Tower', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_hydroponic_tower.js', importName: 'createHydroponicTower' },
  { id: 'agronomy_smart_irrigation', name: 'Smart Irrigation', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_smart_irrigation.js', importName: 'createSmartIrrigation' },
  { id: 'agronomy_soil_sensor_array', name: 'Soil Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'agronomy', importPath: './machines/agronomy_soil_sensor_array.js', importName: 'createSoilSensorArray' },
  { id: 'airborne-dispersion-chamber', name: 'Airborne-Dispersion-Chamber', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/airborne-dispersion-chamber.js', importName: 'createAirborneDispersionChamber' },
  { id: 'air_data_computer', name: 'Data Computer', icon: '&#x2699;&#xFE0F;', category: 'air', importPath: './machines/air_data_computer.js', importName: 'createAirDataComputer' },
  { id: 'algebra_complex_roots', name: 'Complex Roots', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_complex_roots.js', importName: 'createComplexRoots' },
  { id: 'algebra_eigenvector_transform', name: 'Eigenvector Transform', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_eigenvector_transform.js', importName: 'createEigenvectorTransform' },
  { id: 'algebra_matrix_multiplication', name: 'Matrix Multiplication', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_matrix_multiplication.js', importName: 'createMatrixMultiplication' },
  { id: 'algebra_quadratic_surface', name: 'Quadratic Surface', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_quadratic_surface.js', importName: 'createQuadraticSurface' },
  { id: 'algebra_vector_field', name: 'Vector Field', icon: '&#x2699;&#xFE0F;', category: 'algebra', importPath: './machines/algebra_vector_field.js', importName: 'createVectorField' },
  { id: 'amber_fossil_resin', name: 'Fossil Resin', icon: '&#x2699;&#xFE0F;', category: 'amber', importPath: './machines/amber_fossil_resin.js', importName: 'createAmberFossilResin' },
  { id: 'amusement_carousel', name: 'Carousel', icon: '&#x2699;&#xFE0F;', category: 'amusement', importPath: './machines/amusement_carousel.js', importName: 'createGrandCarousel' },
  { id: 'amusement_drop_tower', name: 'Drop Tower', icon: '&#x2699;&#xFE0F;', category: 'amusement', importPath: './machines/amusement_drop_tower.js', importName: 'createDropTower' },
  { id: 'amusement_ferris_wheel', name: 'Ferris Wheel', icon: '&#x2699;&#xFE0F;', category: 'amusement', importPath: './machines/amusement_ferris_wheel.js', importName: 'createFerrisWheel' },
  { id: 'amusement_pendulum', name: 'Pendulum', icon: '&#x2699;&#xFE0F;', category: 'amusement', importPath: './machines/amusement_pendulum.js', importName: 'createPendulumSwing' },
  { id: 'amusement_rollercoaster', name: 'Rollercoaster', icon: '&#x2699;&#xFE0F;', category: 'amusement', importPath: './machines/amusement_rollercoaster.js', importName: 'createRollercoaster' },
  { id: 'anamorphic_lens', name: 'Lens', icon: '&#x2699;&#xFE0F;', category: 'anamorphic', importPath: './machines/anamorphic_lens.js', importName: 'createAnamorphicLens' },
  { id: 'anatomy_cardiovascular', name: 'Cardiovascular', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_cardiovascular.js', importName: 'createCardiovascular' },
  { id: 'anatomy_nervous', name: 'Nervous', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_nervous.js', importName: 'createNervous' },
  { id: 'anatomy_organs', name: 'Organs', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_organs.js', importName: 'createOrgans' },
  { id: 'anatomy_skeleton', name: 'Skeleton', icon: '&#x2699;&#xFE0F;', category: 'anatomy', importPath: './machines/anatomy_skeleton.js', importName: 'createAnatomySkeleton' },
  { id: 'antibody_antigen_binding', name: 'Antigen Binding', icon: '&#x2699;&#xFE0F;', category: 'antibody', importPath: './machines/antibody_antigen_binding.js', importName: 'createAntibodyAntigen' },
  { id: 'artificial_intelligence_cognitive_array', name: 'Intelligence Cognitive Array', icon: '&#x2699;&#xFE0F;', category: 'artificial', importPath: './machines/artificial_intelligence_cognitive_array.js', importName: 'createCognitiveArray' },
  { id: 'artificial_intelligence_data_nexus', name: 'Intelligence Data Nexus', icon: '&#x2699;&#xFE0F;', category: 'artificial', importPath: './machines/artificial_intelligence_data_nexus.js', importName: 'createDataNexus' },
  { id: 'artificial_intelligence_holographic_core', name: 'Intelligence Holographic Core', icon: '&#x2699;&#xFE0F;', category: 'artificial', importPath: './machines/artificial_intelligence_holographic_core.js', importName: 'createHolographicCore' },
  { id: 'artificial_intelligence_neural_network', name: 'Intelligence Neural Network', icon: '&#x2699;&#xFE0F;', category: 'artificial', importPath: './machines/artificial_intelligence_neural_network.js', importName: 'createNeuralNetwork' },
  { id: 'artificial_intelligence_quantum_processor', name: 'Intelligence Quantum Processor', icon: '&#x2699;&#xFE0F;', category: 'artificial', importPath: './machines/artificial_intelligence_quantum_processor.js', importName: 'createQuantumProcessor' },
  { id: 'astrobiology_biosignature_detector', name: 'Biosignature Detector', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_biosignature_detector.js', importName: 'createBiosignatureDetector' },
  { id: 'astrobiology_exoplanet_incubator', name: 'Exoplanet Incubator', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_exoplanet_incubator.js', importName: 'createExoplanetIncubator' },
  { id: 'astrobiology_extremophile_centrifuge', name: 'Extremophile Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_extremophile_centrifuge.js', importName: 'createExtremophileCentrifuge' },
  { id: 'astrobiology_panspermia_vessel', name: 'Panspermia Vessel', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_panspermia_vessel.js', importName: 'createPanspermiaVessel' },
  { id: 'astrobiology_xenobiology_microscope', name: 'Xenobiology Microscope', icon: '&#x2699;&#xFE0F;', category: 'astrobiology', importPath: './machines/astrobiology_xenobiology_microscope.js', importName: 'createXenobiologyMicroscope' },
  { id: 'astrochemistry_cometary_coma', name: 'Cometary Coma', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_cometary_coma.js', importName: 'createCometaryComa' },
  { id: 'astrochemistry_interstellar_ice_dust', name: 'Interstellar Ice Dust', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_interstellar_ice_dust.js', importName: 'createInterstellarIceDust' },
  { id: 'astrochemistry_molecular_cloud', name: 'Molecular Cloud', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_molecular_cloud.js', importName: 'createMolecularCloud' },
  { id: 'astrochemistry_protoplanetary_disk', name: 'Protoplanetary Disk', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_protoplanetary_disk.js', importName: 'createProtoplanetaryDisk' },
  { id: 'astrochemistry_spectrometer', name: 'Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'astrochemistry', importPath: './machines/astrochemistry_spectrometer.js', importName: 'createAstrochemistrySpectrometer' },
  { id: 'astrophysics_binary_star', name: 'Binary Star', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_binary_star.js', importName: 'createBinaryStar' },
  { id: 'astrophysics_black_hole', name: 'Black Hole', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_black_hole.js', importName: 'createBlackHole' },
  { id: 'astrophysics_galaxy', name: 'Galaxy', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_galaxy.js', importName: 'createGalaxy' },
  { id: 'astrophysics_pulsar', name: 'Pulsar', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_pulsar.js', importName: 'createPulsar' },
  { id: 'astrophysics_solar_system', name: 'Solar System', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_solar_system.js', importName: 'createSolarSystem' },
  { id: 'astroseismology_acoustic_waves', name: 'Astroseismology Acoustic Waves', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/astroseismology_acoustic_waves.js', importName: 'createAcousticWaves' },
  { id: 'astroseismology_core_resonance', name: 'Core Resonance', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_core_resonance.js', importName: 'createCoreResonance' },
  { id: 'astroseismology_doppler_imager', name: 'Doppler Imager', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_doppler_imager.js', importName: 'createDopplerImager' },
  { id: 'astroseismology_pulsation_modes', name: 'Pulsation Modes', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_pulsation_modes.js', importName: 'createPulsationModes' },
  { id: 'astroseismology_stellar_oscillator', name: 'Stellar Oscillator', icon: '&#x2699;&#xFE0F;', category: 'astroseismology', importPath: './machines/astroseismology_stellar_oscillator.js', importName: 'createStellarOscillator' },
  { id: 'astro_ccd_sensor_array', name: 'Ccd Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_ccd_sensor_array.js', importName: 'createCCDSensorArray' },
  { id: 'astro_deformable_mirror', name: 'Deformable Mirror', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_deformable_mirror.js', importName: 'createDeformableMirror' },
  { id: 'astro_interferometer_arm', name: 'Interferometer Arm', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_interferometer_arm.js', importName: 'createInterferometerArm' },
  { id: 'astro_neutrino_pmt', name: 'Astro Neutrino Pmt', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/astro_neutrino_pmt.js', importName: 'createNeutrinoPMT' },
  { id: 'astro_space_coronagraph', name: 'Space Coronagraph', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_space_coronagraph.js', importName: 'createCoronagraphMask' },
  { id: 'astro_space_radio_feed_horn', name: 'Space Radio Feed Horn', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_space_radio_feed_horn.js', importName: 'createRadioFeedHorn' },
  { id: 'astro_space_star_tracker', name: 'Space Star Tracker', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_space_star_tracker.js', importName: 'createStarTracker' },
  { id: 'astro_space_sunshield', name: 'Space Sunshield', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_space_sunshield.js', importName: 'createSpaceSunshield' },
  { id: 'astro_space_xray_mirror', name: 'Space Xray Mirror', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_space_xray_mirror.js', importName: 'createXRayMirror' },
  { id: 'astro_spectrograph_grating', name: 'Spectrograph Grating', icon: '&#x2699;&#xFE0F;', category: 'astro', importPath: './machines/astro_spectrograph_grating.js', importName: 'createSpectrographGrating' },
  { id: 'atmospheric_anemometer', name: 'Anemometer', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_anemometer.js', importName: 'createAnemometerArray' },
  { id: 'atmospheric_cell_dynamics', name: 'Cell Dynamics', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_cell_dynamics.js', importName: 'createAtmosphericCellDynamics' },
  { id: 'atmospheric_cloud_seeder', name: 'Cloud Seeder', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_cloud_seeder.js', importName: 'createCloudSeeder' },
  { id: 'atmospheric_doppler_radar', name: 'Doppler Radar', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'atmospheric_lidar', name: 'Lidar', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_lidar.js', importName: 'createAtmosphericLidar' },
  { id: 'atmospheric_lidar_profiler', name: 'Lidar Profiler', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_lidar_profiler.js', importName: 'createLidarProfiler' },
  { id: 'atmospheric_weather_balloon', name: 'Weather Balloon', icon: '&#x2699;&#xFE0F;', category: 'atmospheric', importPath: './machines/atmospheric_weather_balloon.js', importName: 'createWeatherBalloon' },
  { id: 'atp_synthase_motor', name: 'Synthase Motor', icon: '&#x2699;&#xFE0F;', category: 'atp', importPath: './machines/atp_synthase_motor.js', importName: 'createATPSynthase' },
  { id: 'audio_condenser_mic', name: 'Condenser Mic', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_condenser_mic.js', importName: 'createCondenserMic' },
  { id: 'audio_dynamic_mic', name: 'Dynamic Mic', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_dynamic_mic.js', importName: 'createDynamicMic' },
  { id: 'audio_loudspeaker', name: 'Loudspeaker', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_loudspeaker.js', importName: 'createLoudspeaker' },
  { id: 'audio_ribbon_tweeter', name: 'Ribbon Tweeter', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_ribbon_tweeter.js', importName: 'createRibbonTweeter' },
  { id: 'audio_tech_dynamic_microphone', name: 'Tech Dynamic Microphone', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_tech_dynamic_microphone.js', importName: 'createDynamicMicrophone' },
  { id: 'audio_tech_electrostatic_speaker', name: 'Tech Electrostatic Speaker', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_tech_electrostatic_speaker.js', importName: 'createElectrostaticSpeaker' },
  { id: 'audio_tech_moving_coil_cartridge', name: 'Tech Moving Coil Cartridge', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_tech_moving_coil_cartridge.js', importName: 'createMovingCoilCartridge' },
  { id: 'audio_tech_reel_to_reel_tape_deck', name: 'Tech Reel To Reel Tape Deck', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_tech_reel_to_reel_tape_deck.js', importName: 'createReelToReelTapeDeck' },
  { id: 'audio_tech_vacuum_tube_amplifier', name: 'Tech Vacuum Tube Amplifier', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_tech_vacuum_tube_amplifier.js', importName: 'createVacuumTubeAmplifier' },
  { id: 'audio_turntable', name: 'Turntable', icon: '&#x2699;&#xFE0F;', category: 'audio', importPath: './machines/audio_turntable.js', importName: 'createTurntable' },
  { id: 'automated_tissue_processor', name: 'Tissue Processor', icon: '&#x2699;&#xFE0F;', category: 'automated', importPath: './machines/automated_tissue_processor.js', importName: 'createAutomatedTissueProcessor' },
  { id: 'automotive_disc_brake', name: 'Disc Brake', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_disc_brake.js', importName: 'createDiscBrake' },
  { id: 'automotive_manual_transmission', name: 'Manual Transmission', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_manual_transmission.js', importName: 'createManualTransmission' },
  { id: 'automotive_open_differential', name: 'Open Differential', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_open_differential.js', importName: 'createOpenDifferential' },
  { id: 'automotive_rack_and_pinion', name: 'Rack And Pinion', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_rack_and_pinion.js', importName: 'createRackAndPinion' },
  { id: 'automotive_suspension_strut', name: 'Suspension Strut', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/automotive_suspension_strut.js', importName: 'createSuspensionStrut' },
  { id: 'avian_respiratory_system', name: 'Respiratory System', icon: '&#x2699;&#xFE0F;', category: 'avian', importPath: './machines/avian_respiratory_system.js', importName: 'createAvianRespiratorySystem' },
  { id: 'avian_wing_structure', name: 'Wing Structure', icon: '&#x2699;&#xFE0F;', category: 'avian', importPath: './machines/avian_wing_structure.js', importName: 'createAvianWingStructure' },
  { id: 'avionics_altimeter', name: 'Altimeter', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_altimeter.js', importName: 'createAvionicsAltimeter' },
  { id: 'avionics_flight_computer', name: 'Flight Computer', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_flight_computer.js', importName: 'createAvionicsFlightComputer' },
  { id: 'avionics_gyroscope', name: 'Gyroscope', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_gyroscope.js', importName: 'createAvionicsGyroscope' },
  { id: 'avionics_pitot_tube', name: 'Pitot Tube', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_pitot_tube.js', importName: 'createAvionicsPitotTube' },
  { id: 'avionics_radar_antenna', name: 'Radar Antenna', icon: '&#x2699;&#xFE0F;', category: 'avionics', importPath: './machines/avionics_radar_antenna.js', importName: 'createAvionicsRadarAntenna' },
  { id: 'bat_echolocation_sonar', name: 'Bat Echolocation Sonar', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/bat_echolocation_sonar.js', importName: 'createBatEcholocation' },
  { id: 'blockchain_ledger', name: 'Ledger', icon: '&#x2699;&#xFE0F;', category: 'blockchain', importPath: './machines/blockchain_ledger.js', importName: 'createBlockchainLedger' },
  { id: 'brachytherapy_afterloader', name: 'Afterloader', icon: '&#x2699;&#xFE0F;', category: 'brachytherapy', importPath: './machines/brachytherapy_afterloader.js', importName: 'createBrachytherapyAfterloader' },
  { id: 'brain_cortex_lobes', name: 'Cortex Lobes', icon: '&#x2699;&#xFE0F;', category: 'brain', importPath: './machines/brain_cortex_lobes.js', importName: 'createBrainCortex' },
  { id: 'calculus_riemann_sum', name: 'Riemann Sum', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_riemann_sum.js', importName: 'createRiemannSum' },
  { id: 'calculus_solid_revolution', name: 'Solid Revolution', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_solid_revolution.js', importName: 'createSolidRevolution' },
  { id: 'calculus_tangent_plane', name: 'Tangent Plane', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_tangent_plane.js', importName: 'createTangentPlane' },
  { id: 'calculus_taylor_series', name: 'Taylor Series', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_taylor_series.js', importName: 'createTaylorSeries' },
  { id: 'calculus_vector_field', name: 'Vector Field', icon: '&#x2699;&#xFE0F;', category: 'calculus', importPath: './machines/calculus_vector_field.js', importName: 'createVectorField' },
  { id: 'camera_imax_projector', name: 'Imax Projector', icon: '&#x2699;&#xFE0F;', category: 'camera', importPath: './machines/camera_imax_projector.js', importName: 'createImaxProjector' },
  { id: 'carbon_cycle_biosphere', name: 'Carbon Cycle Biosphere', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/carbon_cycle_biosphere.js', importName: 'createCarbonCycleBiosphere' },
  { id: 'carbon_nanotube_weaver', name: 'Carbon Nanotube Weaver', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/carbon_nanotube_weaver.js', importName: 'createCarbonNanotubeWeaver' },
  { id: 'casino_card_shuffler', name: 'Card Shuffler', icon: '&#x2699;&#xFE0F;', category: 'casino', importPath: './machines/casino_card_shuffler.js', importName: 'createCardShuffler' },
  { id: 'casino_chip_sorter', name: 'Chip Sorter', icon: '&#x2699;&#xFE0F;', category: 'casino', importPath: './machines/casino_chip_sorter.js', importName: 'createChipSorter' },
  { id: 'casino_dice_tumbler', name: 'Dice Tumbler', icon: '&#x2699;&#xFE0F;', category: 'casino', importPath: './machines/casino_dice_tumbler.js', importName: 'createDiceTumbler' },
  { id: 'casino_roulette_wheel', name: 'Roulette Wheel', icon: '&#x2699;&#xFE0F;', category: 'casino', importPath: './machines/casino_roulette_wheel.js', importName: 'createRouletteWheel' },
  { id: 'casino_slot_machine', name: 'Slot Machine', icon: '&#x2699;&#xFE0F;', category: 'casino', importPath: './machines/casino_slot_machine.js', importName: 'createSlotMachine' },
  { id: 'ccs_amine_scrubber_column', name: 'Amine Scrubber Column', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/ccs_amine_scrubber_column.js', importName: 'createAmineScrubberColumn' },
  { id: 'ccs_artificial_photosynthetic_leaf_reactor', name: 'Artificial Photosynthetic Leaf Reactor', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/ccs_artificial_photosynthetic_leaf_reactor.js', importName: 'createArtificialPhotosyntheticLeafReactor' },
  { id: 'ccs_carbon_mineralization_injector', name: 'Carbon Mineralization Injector', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/ccs_carbon_mineralization_injector.js', importName: 'createCarbonMineralizationInjector' },
  { id: 'ccs_co2_compression_centrifuge', name: 'Co2 Compression Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/ccs_co2_compression_centrifuge.js', importName: 'createCO2CompressionCentrifuge' },
  { id: 'ccs_direct_air_capture_fan_array', name: 'Direct Air Capture Fan Array', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/ccs_direct_air_capture_fan_array.js', importName: 'createDirectAirCaptureFanArray' },
  { id: 'cell_biology', name: 'Biology', icon: '&#x2699;&#xFE0F;', category: 'cell', importPath: './machines/cell_biology.js', importName: 'createCell' },
  { id: 'cell_phase5', name: 'Phase5', icon: '&#x2699;&#xFE0F;', category: 'cell', importPath: './machines/cell_phase5.js', importName: 'createCellPhase5' },
  { id: 'centrifugal_pump', name: 'Pump', icon: '&#x2699;&#xFE0F;', category: 'centrifugal', importPath: './machines/centrifugal_pump.js', importName: 'createCentrifugalPump' },
  { id: 'chameleon_tongue_mechanism', name: 'Tongue Mechanism', icon: '&#x2699;&#xFE0F;', category: 'chameleon', importPath: './machines/chameleon_tongue_mechanism.js', importName: 'createChameleonTongue' },
  { id: 'cinema_film_projector', name: 'Film Projector', icon: '&#x2699;&#xFE0F;', category: 'cinema', importPath: './machines/cinema_film_projector.js', importName: 'createFilmProjector' },
  { id: 'cinema_imax_camera', name: 'Imax Camera', icon: '&#x2699;&#xFE0F;', category: 'cinema', importPath: './machines/cinema_imax_camera.js', importName: 'createImaxCamera' },
  { id: 'cinema_motion_control_robot', name: 'Motion Control Robot', icon: '&#x2699;&#xFE0F;', category: 'cinema', importPath: './machines/cinema_motion_control_robot.js', importName: 'createMotionControlRobot' },
  { id: 'cinema_steadicam_rig', name: 'Steadicam Rig', icon: '&#x2699;&#xFE0F;', category: 'cinema', importPath: './machines/cinema_steadicam_rig.js', importName: 'createSteadicamRig' },
  { id: 'cinema_studio_lighting', name: 'Studio Lighting', icon: '&#x2699;&#xFE0F;', category: 'cinema', importPath: './machines/cinema_studio_lighting.js', importName: 'createStudioLightingTruss' },
  { id: 'civil_airport_runway_lighting_system', name: 'Airport Runway Lighting System', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_airport_runway_lighting_system.js', importName: 'createAirportRunwayLightingSystem' },
  { id: 'civil_bascule_bridge', name: 'Bascule Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_bascule_bridge.js', importName: 'createBasculeBridge' },
  { id: 'civil_box_girder_bridge_segment', name: 'Box Girder Bridge Segment', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_box_girder_bridge_segment.js', importName: 'createBoxGirderBridgeSegment' },
  { id: 'civil_breakwater_tetrapods', name: 'Breakwater Tetrapods', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_breakwater_tetrapods.js', importName: 'createBreakwaterTetrapodArray' },
  { id: 'civil_cable_stayed_pylon', name: 'Cable Stayed Pylon', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_cable_stayed_pylon.js', importName: 'createCableStayedPylon' },
  { id: 'civil_canal_lock_gates', name: 'Canal Lock Gates', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_canal_lock_gates.js', importName: 'createCanalLockGates' },
  { id: 'civil_concrete_mixer_truck', name: 'Concrete Mixer Truck', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_concrete_mixer_truck.js', importName: 'createConcreteMixerTruck' },
  { id: 'civil_crane_slew_ring', name: 'Crane Slew Ring', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_crane_slew_ring.js', importName: 'createTowerCraneSlewRing' },
  { id: 'civil_geodesic_dome', name: 'Geodesic Dome', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_geodesic_dome.js', importName: 'createGeodesicDome' },
  { id: 'civil_gravity_dam_spillway', name: 'Gravity Dam Spillway', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_gravity_dam_spillway.js', importName: 'createGravityDamSpillway' },
  { id: 'civil_highway_overpass_interchange', name: 'Highway Overpass Interchange', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_highway_overpass_interchange.js', importName: 'createHighwayOverpassInterchange' },
  { id: 'civil_precast_concrete_pile_driver', name: 'Precast Concrete Pile Driver', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_precast_concrete_pile_driver.js', importName: 'createPrecastConcretePileDriver' },
  { id: 'civil_retaining_wall', name: 'Retaining Wall', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_retaining_wall.js', importName: 'createAnchoredEarthRetainingWall' },
  { id: 'civil_suspension_anchor', name: 'Suspension Anchor', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_suspension_anchor.js', importName: 'createSuspensionAnchor' },
  { id: 'civil_suspension_bridge_cable_anchor', name: 'Suspension Bridge Cable Anchor', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_suspension_bridge_cable_anchor.js', importName: 'createSuspensionBridgeCableAnchor' },
  { id: 'civil_suspension_saddle', name: 'Suspension Saddle', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_suspension_saddle.js', importName: 'createSuspensionSaddle' },
  { id: 'civil_swing_bridge', name: 'Swing Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_swing_bridge.js', importName: 'createSwingBridge' },
  { id: 'civil_tower_crane', name: 'Tower Crane', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tower_crane.js', importName: 'createTowerCrane' },
  { id: 'civil_truss_bridge_joint', name: 'Truss Bridge Joint', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_truss_bridge_joint.js', importName: 'createTrussBridgeJoint' },
  { id: 'civil_tuned_mass_damper', name: 'Tuned Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tuned_mass_damper.js', importName: 'createTunedMassDamper' },
  { id: 'civil_tunneling_ring', name: 'Tunneling Ring', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tunneling_ring.js', importName: 'createShieldTunnelingRing' },
  { id: 'civil_tunnel_boring_machine', name: 'Tunnel Boring Machine', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tunnel_boring_machine.js', importName: 'createTunnelBoringMachine' },
  { id: 'climatology_atmospheric_lidar', name: 'Atmospheric Lidar', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_atmospheric_lidar.js', importName: 'createAtmosphericLidar' },
  { id: 'climatology_ice_core_drill', name: 'Ice Core Drill', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_ice_core_drill.js', importName: 'createIceCoreDrill' },
  { id: 'climatology_ocean_buoy', name: 'Ocean Buoy', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_ocean_buoy.js', importName: 'createOceanBuoy' },
  { id: 'climatology_weather_station', name: 'Weather Station', icon: '&#x2699;&#xFE0F;', category: 'climatology', importPath: './machines/climatology_weather_station.js', importName: 'createWeatherStation' },
  { id: 'clinical_flow_cytometer', name: 'Flow Cytometer', icon: '&#x2699;&#xFE0F;', category: 'clinical', importPath: './machines/clinical_flow_cytometer.js', importName: 'createClinicalFlowCytometer' },
  { id: 'clockwork_clock_escapement', name: 'Clock Escapement', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_clock_escapement.js', importName: 'createClockEscapement' },
  { id: 'clockwork_drafting_automaton', name: 'Drafting Automaton', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_drafting_automaton.js', importName: 'createDraftingAutomaton' },
  { id: 'clockwork_mechanical_orrery', name: 'Mechanical Orrery', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_mechanical_orrery.js', importName: 'createMechanicalOrrery' },
  { id: 'clockwork_metronome', name: 'Metronome', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_metronome.js', importName: 'createMetronome' },
  { id: 'clockwork_singing_bird_box', name: 'Singing Bird Box', icon: '&#x2699;&#xFE0F;', category: 'clockwork', importPath: './machines/clockwork_singing_bird_box.js', importName: 'createSingingBirdBox' },
  { id: 'clock_escapement', name: 'Escapement', icon: '&#x2699;&#xFE0F;', category: 'clock', importPath: './machines/clock_escapement.js', importName: 'createClockEscapement' },
  { id: 'cnc_machine', name: 'Machine', icon: '&#x2699;&#xFE0F;', category: 'cnc', importPath: './machines/cnc_machine.js', importName: 'createCNCMachine' },
  { id: 'cnn_architecture', name: 'Architecture', icon: '&#x2699;&#xFE0F;', category: 'cnn', importPath: './machines/cnn_architecture.js', importName: 'createConvolutionalNeuralNetwork' },
  { id: 'cochlea_hair_cells', name: 'Hair Cells', icon: '&#x2699;&#xFE0F;', category: 'cochlea', importPath: './machines/cochlea_hair_cells.js', importName: 'createCochleaHairCells' },
  { id: 'comm_satellite', name: 'Satellite', icon: '&#x2699;&#xFE0F;', category: 'comm', importPath: './machines/comm_satellite.js', importName: 'createCommSatellite' },
  { id: 'compound_light_microscope', name: 'Light Microscope', icon: '&#x2699;&#xFE0F;', category: 'compound', importPath: './machines/compound_light_microscope.js', importName: 'createCompoundLightMicroscope' },
  { id: 'computer_architecture_alu', name: 'Architecture Alu', icon: '&#x2699;&#xFE0F;', category: 'computer', importPath: './machines/computer_architecture_alu.js', importName: 'createAlu' },
  { id: 'computer_architecture_cache_hierarchy', name: 'Architecture Cache Hierarchy', icon: '&#x2699;&#xFE0F;', category: 'computer', importPath: './machines/computer_architecture_cache_hierarchy.js', importName: 'createCacheHierarchy' },
  { id: 'computer_architecture_turing_machine', name: 'Architecture Turing Machine', icon: '&#x2699;&#xFE0F;', category: 'computer', importPath: './machines/computer_architecture_turing_machine.js', importName: 'createTuringMachine' },
  { id: 'computer_architecture_von_neumann', name: 'Architecture Von Neumann', icon: '&#x2699;&#xFE0F;', category: 'computer', importPath: './machines/computer_architecture_von_neumann.js', importName: 'createVonNeumann' },
  { id: 'coral_reef', name: 'Reef', icon: '&#x2699;&#xFE0F;', category: 'coral', importPath: './machines/coral_reef.js', importName: 'createCoralReef' },
  { id: 'cosmochemistry_chondrule_furnace', name: 'Chondrule Furnace', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_chondrule_furnace.js', importName: 'createChondruleFurnace' },
  { id: 'cosmochemistry_cometary_sublimator', name: 'Cometary Sublimator', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_cometary_sublimator.js', importName: 'createCometarySublimator' },
  { id: 'cosmochemistry_ion_probe', name: 'Ion Probe', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_ion_probe.js', importName: 'createIonProbe' },
  { id: 'cosmochemistry_isotope_analyzer', name: 'Isotope Analyzer', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_isotope_analyzer.js', importName: 'createIsotopeAnalyzer' },
  { id: 'cosmochemistry_nebula_simulator', name: 'Nebula Simulator', icon: '&#x2699;&#xFE0F;', category: 'cosmochemistry', importPath: './machines/cosmochemistry_nebula_simulator.js', importName: 'createNebulaSimulator' },
  { id: 'covalent_ionic_bonding', name: 'Ionic Bonding', icon: '&#x2699;&#xFE0F;', category: 'covalent', importPath: './machines/covalent_ionic_bonding.js', importName: 'createChemicalBonding' },
  { id: 'cpu_architecture', name: 'Architecture', icon: '&#x2699;&#xFE0F;', category: 'cpu', importPath: './machines/cpu_architecture.js', importName: 'createCPU' },
  { id: 'crispr_cas9_editing', name: 'Cas9 Editing', icon: '&#x2699;&#xFE0F;', category: 'crispr', importPath: './machines/crispr_cas9_editing.js', importName: 'createCRISPR' },
  { id: 'cryogenics_cryopump', name: 'Cryogenics Cryopump', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryogenics_cryopump.js', importName: 'createCryopump' },
  { id: 'cryogenics_dewar_flask', name: 'Cryogenics Dewar Flask', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/cryogenics_dewar_flask.js', importName: 'createDewarFlask' },
  { id: 'cryogenics_dilution_refrigerator', name: 'Cryogenics Dilution Refrigerator', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryogenics_dilution_refrigerator.js', importName: 'createDilutionRefrigerator' },
  { id: 'cryogenics_liquefier', name: 'Cryogenics Liquefier', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryogenics_liquefier.js', importName: 'createLiquefier' },
  { id: 'cryogenics_superconducting_magnet', name: 'Cryogenics Superconducting Magnet', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryogenics_superconducting_magnet.js', importName: 'createSuperconductingMagnet' },
  { id: 'cryo_cmos_processor', name: 'Cmos Processor', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryo_cmos_processor.js', importName: 'createCryoCMOSProcessor' },
  { id: 'cryo_dilution_refrigerator', name: 'Dilution Refrigerator', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryo_dilution_refrigerator.js', importName: 'createDilutionRefrigeratorCore' },
  { id: 'cryo_helium3_pump', name: 'Helium3 Pump', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryo_helium3_pump.js', importName: 'createHelium3RecirculationPump' },
  { id: 'cryo_josephson_junction', name: 'Josephson Junction', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryo_josephson_junction.js', importName: 'createJosephsonJunctionArray' },
  { id: 'cryo_superconducting_interconnects', name: 'Superconducting Interconnects', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/cryo_superconducting_interconnects.js', importName: 'createSuperconductingInterconnects' },
  { id: 'cryptography_enigma_machine', name: 'Enigma Machine', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_enigma_machine.js', importName: 'createEnigmaMachine' },
  { id: 'cryptography_quantum_key_distribution', name: 'Quantum Key Distribution', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_quantum_key_distribution.js', importName: 'createQuantumKeyDistribution' },
  { id: 'cryptography_rsa_encryption', name: 'Rsa Encryption', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_rsa_encryption.js', importName: 'createRSAEncryption' },
  { id: 'cryptography_sha256_hash', name: 'Sha256 Hash', icon: '&#x2699;&#xFE0F;', category: 'cryptography', importPath: './machines/cryptography_sha256_hash.js', importName: 'createSHA256Hash' },
  { id: 'cybernetics_bci_array', name: 'Bci Array', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_bci_array.js', importName: 'createBCIArray' },
  { id: 'cybernetics_bionic_arm', name: 'Bionic Arm', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_bionic_arm.js', importName: 'createBionicArm' },
  { id: 'cybernetics_exoskeleton_joint', name: 'Exoskeleton Joint', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_exoskeleton_joint.js', importName: 'createExoskeletonJoint' },
  { id: 'cybernetics_neural_interface', name: 'Neural Interface', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_neural_interface.js', importName: 'createNeuralInterface' },
  { id: 'cybernetics_synthetic_retina', name: 'Synthetic Retina', icon: '&#x2699;&#xFE0F;', category: 'cybernetics', importPath: './machines/cybernetics_synthetic_retina.js', importName: 'createSyntheticRetina' },
  { id: 'cytology_animal_cell', name: 'Animal Cell', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_animal_cell.js', importName: 'createAnimalCell' },
  { id: 'cytology_cell_membrane', name: 'Cell Membrane', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_cell_membrane.js', importName: 'createCellMembrane' },
  { id: 'cytology_golgi_apparatus', name: 'Golgi Apparatus', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_golgi_apparatus.js', importName: 'createGolgiApparatus' },
  { id: 'cytology_mitochondrion', name: 'Mitochondrion', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_mitochondrion.js', importName: 'createMitochondrion' },
  { id: 'cytology_nucleus_dna', name: 'Nucleus Dna', icon: '&#x2699;&#xFE0F;', category: 'cytology', importPath: './machines/cytology_nucleus_dna.js', importName: 'createNucleusDNA' },
  { id: 'data_center_switch', name: 'Center Switch', icon: '&#x2699;&#xFE0F;', category: 'data', importPath: './machines/data_center_switch.js', importName: 'createDataCenterSwitch' },
  { id: 'da_vinci_aerial_screw', name: 'Vinci Aerial Screw', icon: '&#x2699;&#xFE0F;', category: 'da', importPath: './machines/da_vinci_aerial_screw.js', importName: 'createAerialScrew' },
  { id: 'da_vinci_armored_tank_gearbox', name: 'Vinci Armored Tank Gearbox', icon: '&#x2699;&#xFE0F;', category: 'da', importPath: './machines/da_vinci_armored_tank_gearbox.js', importName: 'createArmoredTankGearbox' },
  { id: 'da_vinci_multi_barrel_cannon', name: 'Vinci Multi Barrel Cannon', icon: '&#x2699;&#xFE0F;', category: 'da', importPath: './machines/da_vinci_multi_barrel_cannon.js', importName: 'createMultiBarrelCannon' },
  { id: 'da_vinci_ornithopter_wings', name: 'Vinci Ornithopter Wings', icon: '&#x2699;&#xFE0F;', category: 'da', importPath: './machines/da_vinci_ornithopter_wings.js', importName: 'createOrnithopterWings' },
  { id: 'da_vinci_paddle_boat_mechanism', name: 'Vinci Paddle Boat Mechanism', icon: '&#x2699;&#xFE0F;', category: 'da', importPath: './machines/da_vinci_paddle_boat_mechanism.js', importName: 'createPaddleBoatMechanism' },
  { id: 'deep_sea_bathysphere', name: 'Sea Bathysphere', icon: '&#x2699;&#xFE0F;', category: 'deep', importPath: './machines/deep_sea_bathysphere.js', importName: 'createBathysphere' },
  { id: 'deep_sea_hydrothermal_vent', name: 'Sea Hydrothermal Vent', icon: '&#x2699;&#xFE0F;', category: 'deep', importPath: './machines/deep_sea_hydrothermal_vent.js', importName: 'createDeepSeaHydrothermalVent' },
  { id: 'deep_sea_rov_arm', name: 'Sea Rov Arm', icon: '&#x2699;&#xFE0F;', category: 'deep', importPath: './machines/deep_sea_rov_arm.js', importName: 'createROVArm' },
  { id: 'deep_sea_sonar_array', name: 'Deep Sea Sonar Array', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/deep_sea_sonar_array.js', importName: 'createSonarArray' },
  { id: 'deep_sea_thruster', name: 'Sea Thruster', icon: '&#x2699;&#xFE0F;', category: 'deep', importPath: './machines/deep_sea_thruster.js', importName: 'createUnderwaterThruster' },
  { id: 'dew_electromagnetic_railgun', name: 'Electromagnetic Railgun', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/dew_electromagnetic_railgun.js', importName: 'createElectromagneticRailgun' },
  { id: 'dew_free_electron_laser', name: 'Free Electron Laser', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/dew_free_electron_laser.js', importName: 'createFreeElectronLaser' },
  { id: 'dew_high_energy_laser_cannon', name: 'High Energy Laser Cannon', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/dew_high_energy_laser_cannon.js', importName: 'createHighEnergyLaserCannon' },
  { id: 'dew_microwave_crowd_disperser', name: 'Microwave Crowd Disperser', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/dew_microwave_crowd_disperser.js', importName: 'createMicrowaveCrowdDisperser' },
  { id: 'dew_particle_beam_accelerator', name: 'Particle Beam Accelerator', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/dew_particle_beam_accelerator.js', importName: 'createParticleBeamAccelerator' },
  { id: 'dialysis_machine', name: 'Machine', icon: '&#x2699;&#xFE0F;', category: 'dialysis', importPath: './machines/dialysis_machine.js', importName: 'createDialysisMachine' },
  { id: 'differential_gear', name: 'Gear', icon: '&#x2699;&#xFE0F;', category: 'differential', importPath: './machines/differential_gear.js', importName: 'createDifferentialGear' },
  { id: 'digestive_system_tract', name: 'System Tract', icon: '&#x2699;&#xFE0F;', category: 'digestive', importPath: './machines/digestive_system_tract.js', importName: 'createDigestiveSystem' },
  { id: 'distillation_column', name: 'Column', icon: '&#x2699;&#xFE0F;', category: 'distillation', importPath: './machines/distillation_column.js', importName: 'createDistillationColumn' },
  { id: 'dna', name: 'Dna', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/dna.js', importName: 'create' },
  { id: 'dna_helix', name: 'Helix', icon: '&#x2699;&#xFE0F;', category: 'dna', importPath: './machines/dna_helix.js', importName: 'createDNAHelix' },
  { id: 'dna_origami_motor', name: 'Origami Motor', icon: '&#x2699;&#xFE0F;', category: 'dna', importPath: './machines/dna_origami_motor.js', importName: 'createDNAOrigamiMotor' },
  { id: 'dna_polymerase', name: 'Polymerase', icon: '&#x2699;&#xFE0F;', category: 'dna', importPath: './machines/dna_polymerase.js', importName: 'createDNAPolymerase' },
  { id: 'dna_replication_fork', name: 'Replication Fork', icon: '&#x2699;&#xFE0F;', category: 'dna', importPath: './machines/dna_replication_fork.js', importName: 'createDNAReplication' },
  { id: 'double_slit_interferometer', name: 'Slit Interferometer', icon: '&#x2699;&#xFE0F;', category: 'double', importPath: './machines/double_slit_interferometer.js', importName: 'createDoubleSlitInterferometer' },
  { id: 'earthquake_fault_line', name: 'Fault Line', icon: '&#x2699;&#xFE0F;', category: 'earthquake', importPath: './machines/earthquake_fault_line.js', importName: 'createEarthquakeFault' },
  { id: 'ecological_succession_timeline', name: 'Succession Timeline', icon: '&#x2699;&#xFE0F;', category: 'ecological', importPath: './machines/ecological_succession_timeline.js', importName: 'createEcologicalSuccession' },
  { id: 'electrical_ac_generator', name: 'Ac Generator', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_ac_generator.js', importName: 'createACGenerator' },
  { id: 'electrical_arc_furnace_electrodes', name: 'Arc Furnace Electrodes', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_arc_furnace_electrodes.js', importName: 'createArcFurnace' },
  { id: 'electrical_faraday_cage', name: 'Faraday Cage', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_faraday_cage.js', importName: 'createFaradayCage' },
  { id: 'electrical_high_voltage_insulator_string', name: 'High Voltage Insulator String', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_high_voltage_insulator_string.js', importName: 'createHighVoltageInsulatorString' },
  { id: 'electrical_hv_circuit_breaker', name: 'Hv Circuit Breaker', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_hv_circuit_breaker.js', importName: 'createCircuitBreaker' },
  { id: 'electrical_hv_transformer', name: 'Hv Transformer', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_hv_transformer.js', importName: 'createTransformer' },
  { id: 'electrical_induction_motor', name: 'Induction Motor', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_induction_motor.js', importName: 'createInductionMotor' },
  { id: 'electrical_linear_induction_motor', name: 'Linear Induction Motor', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_linear_induction_motor.js', importName: 'createLinearInductionMotor' },
  { id: 'electrical_power_grid_capacitor_bank', name: 'Power Grid Capacitor Bank', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_power_grid_capacitor_bank.js', importName: 'createPowerGridCapacitorBank' },
  { id: 'electrical_relay_switch_logic', name: 'Relay Switch Logic', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_relay_switch_logic.js', importName: 'createRelaySwitchLogic' },
  { id: 'electrical_stator_commutator', name: 'Stator Commutator', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_stator_commutator.js', importName: 'createStatorCommutator' },
  { id: 'electrical_submarine_power_cable', name: 'Submarine Power Cable', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_submarine_power_cable.js', importName: 'createSubmarinePowerCable' },
  { id: 'electrical_substation_switchgear', name: 'Substation Switchgear', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_substation_switchgear.js', importName: 'createSubstationSwitchgear' },
  { id: 'electrical_synchronous_condenser', name: 'Synchronous Condenser', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_synchronous_condenser.js', importName: 'createSynchronousCondenser' },
  { id: 'electrical_wind_turbine_nacelle', name: 'Wind Turbine Nacelle', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_wind_turbine_nacelle.js', importName: 'createWindTurbineGenerator' },
  { id: 'electromagnetic_seismometer', name: 'Seismometer', icon: '&#x2699;&#xFE0F;', category: 'electromagnetic', importPath: './machines/electromagnetic_seismometer.js', importName: 'createElectromagneticSeismometer' },
  { id: 'electron_microscope', name: 'Microscope', icon: '&#x2699;&#xFE0F;', category: 'electron', importPath: './machines/electron_microscope.js', importName: 'createElectronMicroscope' },
  { id: 'endoplasmic_reticulum', name: 'Reticulum', icon: '&#x2699;&#xFE0F;', category: 'endoplasmic', importPath: './machines/endoplasmic_reticulum.js', importName: 'createEndoplasmicReticulum' },
  { id: 'energy_biomass_gasifier', name: 'Biomass Gasifier', icon: '&#x2699;&#xFE0F;', category: 'energy', importPath: './machines/energy_biomass_gasifier.js', importName: 'createBiomassGasifier' },
  { id: 'energy_geothermal_heat_pump', name: 'Energy Geothermal Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/energy_geothermal_heat_pump.js', importName: 'createGeothermalHeatPump' },
  { id: 'energy_offshore_turbine', name: 'Offshore Turbine', icon: '&#x2699;&#xFE0F;', category: 'energy', importPath: './machines/energy_offshore_turbine.js', importName: 'createOffshoreTurbine' },
  { id: 'energy_solar_trough', name: 'Solar Trough', icon: '&#x2699;&#xFE0F;', category: 'energy', importPath: './machines/energy_solar_trough.js', importName: 'createSolarTrough' },
  { id: 'energy_tidal_barrage', name: 'Tidal Barrage', icon: '&#x2699;&#xFE0F;', category: 'energy', importPath: './machines/energy_tidal_barrage.js', importName: 'createTidalBarrageTurbine' },
  { id: 'enigma_machine', name: 'Machine', icon: '&#x2699;&#xFE0F;', category: 'enigma', importPath: './machines/enigma_machine.js', importName: 'createEnigmaMachine' },
  { id: 'enzyme_catalysis_lock_key', name: 'Catalysis Lock Key', icon: '&#x2699;&#xFE0F;', category: 'enzyme', importPath: './machines/enzyme_catalysis_lock_key.js', importName: 'createEnzymeCatalysis' },
  { id: 'epidemiology_epidemic_curve', name: 'Epidemic Curve', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_epidemic_curve.js', importName: 'createEpidemicCurvePlotter' },
  { id: 'epidemiology_pathogen_anatomy', name: 'Pathogen Anatomy', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_pathogen_anatomy.js', importName: 'createPathogenAnatomy' },
  { id: 'epidemiology_sir_model', name: 'Sir Model', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_sir_model.js', importName: 'createSIRModelVisualizer' },
  { id: 'epidemiology_vaccine_mechanism', name: 'Vaccine Mechanism', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_vaccine_mechanism.js', importName: 'createVaccineMechanism' },
  { id: 'epidemiology_virus_network', name: 'Virus Network', icon: '&#x2699;&#xFE0F;', category: 'epidemiology', importPath: './machines/epidemiology_virus_network.js', importName: 'createVirusSpreadingNetwork' },
  { id: 'epigenetics_chromatin_remodeling', name: 'Chromatin Remodeling', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_chromatin_remodeling.js', importName: 'createChromatinRemodeling' },
  { id: 'epigenetics_dna_methylation', name: 'Dna Methylation', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_dna_methylation.js', importName: 'createDNAMethylation' },
  { id: 'epigenetics_histone_modification', name: 'Histone Modification', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_histone_modification.js', importName: 'createHistoneModification' },
  { id: 'epigenetics_nucleosome_sliding', name: 'Nucleosome Sliding', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_nucleosome_sliding.js', importName: 'createNucleosomeSliding' },
  { id: 'epigenetics_rna_interference', name: 'Rna Interference', icon: '&#x2699;&#xFE0F;', category: 'epigenetics', importPath: './machines/epigenetics_rna_interference.js', importName: 'createRNAInterference' },
  { id: 'espionage_crypto_cylinder', name: 'Crypto Cylinder', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_crypto_cylinder.js', importName: 'createCryptographicCylinder' },
  { id: 'espionage_enigma', name: 'Enigma', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_enigma.js', importName: 'createEnigmaMachine' },
  { id: 'espionage_microdot_camera', name: 'Microdot Camera', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_microdot_camera.js', importName: 'createMicrodotCamera' },
  { id: 'espionage_poison_umbrella', name: 'Poison Umbrella', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_poison_umbrella.js', importName: 'createPoisonUmbrella' },
  { id: 'espionage_wiretap', name: 'Wiretap', icon: '&#x2699;&#xFE0F;', category: 'espionage', importPath: './machines/espionage_wiretap.js', importName: 'createWiretapDevice' },
  { id: 'exobiology_alien_flora', name: 'Alien Flora', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_alien_flora.js', importName: 'createAlienFlora' },
  { id: 'exobiology_biosignature_analyzer', name: 'Biosignature Analyzer', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_biosignature_analyzer.js', importName: 'createBiosignatureAnalyzer' },
  { id: 'exobiology_panspermia_spore', name: 'Panspermia Spore', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_panspermia_spore.js', importName: 'createPanspermiaSpore' },
  { id: 'exobiology_silicon_lifeform', name: 'Silicon Lifeform', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_silicon_lifeform.js', importName: 'createSiliconLifeform' },
  { id: 'exobiology_xenobot', name: 'Xenobot', icon: '&#x2699;&#xFE0F;', category: 'exobiology', importPath: './machines/exobiology_xenobot.js', importName: 'createXenobot' },
  { id: 'exotic_dark_matter_interactor', name: 'Exotic Dark Matter Interactor', icon: '&#x2699;&#xFE0F;', category: 'exotic_matter', importPath: './machines/exotic_dark_matter_interactor.js', importName: 'createDarkMatterWeakInteractor' },
  { id: 'exotic_negative_mass_trap', name: 'Exotic Negative Mass Trap', icon: '&#x2699;&#xFE0F;', category: 'exotic_matter', importPath: './machines/exotic_negative_mass_trap.js', importName: 'createNegativeMassTrap' },
  { id: 'exotic_quark_gluon_plasma_chamber', name: 'Exotic Quark Gluon Plasma Chamber', icon: '&#x2699;&#xFE0F;', category: 'exotic_matter', importPath: './machines/exotic_quark_gluon_plasma_chamber.js', importName: 'createQuarkGluonPlasmaChamber' },
  { id: 'exotic_strangelet_stabilizer', name: 'Exotic Strangelet Stabilizer', icon: '&#x2699;&#xFE0F;', category: 'exotic_matter', importPath: './machines/exotic_strangelet_stabilizer.js', importName: 'createStrangeletStabilizer' },
  { id: 'exotic_tachyon_catcher', name: 'Exotic Tachyon Catcher', icon: '&#x2699;&#xFE0F;', category: 'exotic_matter', importPath: './machines/exotic_tachyon_catcher.js', importName: 'createTachyonCatcher' },
  { id: 'eye_retina_photoreceptors', name: 'Retina Photoreceptors', icon: '&#x2699;&#xFE0F;', category: 'eye', importPath: './machines/eye_retina_photoreceptors.js', importName: 'createEyeRetina' },
  { id: 'file_system_inode', name: 'System Inode', icon: '&#x2699;&#xFE0F;', category: 'file', importPath: './machines/file_system_inode.js', importName: 'createFileSystemInode' },
  { id: 'flight_management_system', name: 'Management System', icon: '&#x2699;&#xFE0F;', category: 'flight', importPath: './machines/flight_management_system.js', importName: 'createFlightManagementSystem' },
  { id: 'flower_reproduction', name: 'Reproduction', icon: '&#x2699;&#xFE0F;', category: 'flower', importPath: './machines/flower_reproduction.js', importName: 'createFlowerReproduction' },
  { id: 'fluids_capillary_wave', name: 'Capillary Wave', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_capillary_wave.js', importName: 'createCapillaryWave' },
  { id: 'fluids_laminar_turbulent_pipe', name: 'Laminar Turbulent Pipe', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_laminar_turbulent_pipe.js', importName: 'createLaminarTurbulentPipe' },
  { id: 'fluids_navier_stokes_grid', name: 'Navier Stokes Grid', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_navier_stokes_grid.js', importName: 'createNavierStokesGrid' },
  { id: 'fluids_sph_dam_break', name: 'Sph Dam Break', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_sph_dam_break.js', importName: 'createSPHDamBreak' },
  { id: 'fluids_vortex_shedding', name: 'Vortex Shedding', icon: '&#x2699;&#xFE0F;', category: 'fluids', importPath: './machines/fluids_vortex_shedding.js', importName: 'createVortexShedding' },
  { id: 'fluid_power_hydraulic_accumulator', name: 'Power Hydraulic Accumulator', icon: '&#x2699;&#xFE0F;', category: 'fluid', importPath: './machines/fluid_power_hydraulic_accumulator.js', importName: 'createHydraulicAccumulator' },
  { id: 'fluid_power_hydraulic_gear_pump', name: 'Power Hydraulic Gear Pump', icon: '&#x2699;&#xFE0F;', category: 'fluid', importPath: './machines/fluid_power_hydraulic_gear_pump.js', importName: 'createHydraulicGearPump' },
  { id: 'fluid_power_hydraulic_press', name: 'Power Hydraulic Press', icon: '&#x2699;&#xFE0F;', category: 'fluid', importPath: './machines/fluid_power_hydraulic_press.js', importName: 'createHydraulicPress' },
  { id: 'fluid_power_pneumatic_cylinder', name: 'Power Pneumatic Cylinder', icon: '&#x2699;&#xFE0F;', category: 'fluid', importPath: './machines/fluid_power_pneumatic_cylinder.js', importName: 'createPneumaticCylinder' },
  { id: 'fluid_power_servo_valve', name: 'Power Servo Valve', icon: '&#x2699;&#xFE0F;', category: 'fluid', importPath: './machines/fluid_power_servo_valve.js', importName: 'createServoValve' },
  { id: 'forest_carbon_sink', name: 'Forest Carbon Sink', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/forest_carbon_sink.js', importName: 'createForestCarbonSink' },
  { id: 'fossilization_process', name: 'Process', icon: '&#x2699;&#xFE0F;', category: 'fossilization', importPath: './machines/fossilization_process.js', importName: 'createFossilizationProcess' },
  { id: 'fractional_distillation', name: 'Distillation', icon: '&#x2699;&#xFE0F;', category: 'fractional', importPath: './machines/fractional_distillation.js', importName: 'createFractionalDistillation' },
  { id: 'galvanic_voltaic_cell', name: 'Voltaic Cell', icon: '&#x2699;&#xFE0F;', category: 'galvanic', importPath: './machines/galvanic_voltaic_cell.js', importName: 'createGalvanicCell' },
  { id: 'gan_architecture', name: 'Architecture', icon: '&#x2699;&#xFE0F;', category: 'gan', importPath: './machines/gan_architecture.js', importName: 'createGenerativeAdversarialNetwork' },
  { id: 'gas_laws_piston', name: 'Laws Piston', icon: '&#x2699;&#xFE0F;', category: 'gas', importPath: './machines/gas_laws_piston.js', importName: 'createGasLawsPiston' },
  { id: 'gel_electrophoresis', name: 'Electrophoresis', icon: '&#x2699;&#xFE0F;', category: 'gel', importPath: './machines/gel_electrophoresis.js', importName: 'createGelElectrophoresis' },
  { id: 'generator', name: 'Generator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/generator.js', importName: 'createGenerator' },
  { id: 'geometry_menger_sponge', name: 'Menger Sponge', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_menger_sponge.js', importName: 'createMengerSponge' },
  { id: 'geometry_mobius', name: 'Mobius', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_mobius.js', importName: 'createMobiusStrip' },
  { id: 'geometry_nested_platonic', name: 'Nested Platonic', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_nested_platonic.js', importName: 'createNestedPlatonicSolids' },
  { id: 'geometry_pseudosphere', name: 'Pseudosphere', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_pseudosphere.js', importName: 'createPseudosphere' },
  { id: 'geometry_tesseract', name: 'Tesseract', icon: '&#x2699;&#xFE0F;', category: 'geometry', importPath: './machines/geometry_tesseract.js', importName: 'createTesseract' },
  { id: 'geomorphology_aeolian_dune_migration', name: 'Aeolian Dune Migration', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_aeolian_dune_migration.js', importName: 'createAeolianDuneMigration' },
  { id: 'geomorphology_coastal_erosion_dynamics', name: 'Coastal Erosion Dynamics', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_coastal_erosion_dynamics.js', importName: 'createCoastalErosionDynamics' },
  { id: 'geomorphology_fluvial_erosion_system', name: 'Fluvial Erosion System', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_fluvial_erosion_system.js', importName: 'createFluvialErosionSystem' },
  { id: 'geomorphology_glacial_retreat_model', name: 'Glacial Retreat Model', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_glacial_retreat_model.js', importName: 'createGlacialRetreatModel' },
  { id: 'geomorphology_tectonic_plate_boundary', name: 'Tectonic Plate Boundary', icon: '&#x2699;&#xFE0F;', category: 'geomorphology', importPath: './machines/geomorphology_tectonic_plate_boundary.js', importName: 'createTectonicPlateBoundary' },
  { id: 'geosynchronous_satellite', name: 'Satellite', icon: '&#x2699;&#xFE0F;', category: 'geosynchronous', importPath: './machines/geosynchronous_satellite.js', importName: 'createGeosynchronousSatellite' },
  { id: 'geothermal_fluid_turbine', name: 'Geothermal Fluid Turbine', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/geothermal_fluid_turbine.js', importName: 'createSupercriticalFluidTurbine' },
  { id: 'geothermal_gyrotron_drill', name: 'Geothermal Gyrotron Drill', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/geothermal_gyrotron_drill.js', importName: 'createGyrotronDrill' },
  { id: 'geothermal_heat_exchanger', name: 'Geothermal Heat Exchanger', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/geothermal_heat_exchanger.js', importName: 'createDeepBoreholeHeatExchanger' },
  { id: 'geothermal_plasma_drill', name: 'Geothermal Plasma Drill', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/geothermal_plasma_drill.js', importName: 'createPlasmaDrillBit' },
  { id: 'geothermal_rock_extruder', name: 'Geothermal Rock Extruder', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/geothermal_rock_extruder.js', importName: 'createRockMeltExtruder' },
  { id: 'get_batch', name: 'Batch', icon: '&#x2699;&#xFE0F;', category: 'get', importPath: './machines/get_batch.js', importName: 'default' },
  { id: 'giant_squid_anatomy', name: 'Squid Anatomy', icon: '&#x2699;&#xFE0F;', category: 'giant', importPath: './machines/giant_squid_anatomy.js', importName: 'createGiantSquidAnatomy' },
  { id: 'glaciology_calving_shelf', name: 'Calving Shelf', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_calving_shelf.js', importName: 'createCalvingShelf' },
  { id: 'glaciology_crevasse_radar', name: 'Crevasse Radar', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_crevasse_radar.js', importName: 'createCrevasseRadar' },
  { id: 'glaciology_glacier_flow', name: 'Glacier Flow', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_glacier_flow.js', importName: 'createGlacierFlow' },
  { id: 'glaciology_ice_core_drill', name: 'Ice Core Drill', icon: '&#x2699;&#xFE0F;', category: 'glaciology', importPath: './machines/glaciology_ice_core_drill.js', importName: 'createIceCoreDrill' },
  { id: 'glaciology_subglacial_probe', name: 'Glaciology Subglacial Probe', icon: '&#x2699;&#xFE0F;', category: 'subglacial_exploration', importPath: './machines/glaciology_subglacial_probe.js', importName: 'createSubglacialProbe' },
  { id: 'glass_cockpit_pfd', name: 'Cockpit Pfd', icon: '&#x2699;&#xFE0F;', category: 'glass', importPath: './machines/glass_cockpit_pfd.js', importName: 'createGlassCockpitPFD' },
  { id: 'golgi_apparatus', name: 'Apparatus', icon: '&#x2699;&#xFE0F;', category: 'golgi', importPath: './machines/golgi_apparatus.js', importName: 'createGolgiApparatus' },
  { id: 'greenhouse_effect_globe', name: 'Effect Globe', icon: '&#x2699;&#xFE0F;', category: 'greenhouse', importPath: './machines/greenhouse_effect_globe.js', importName: 'createGreenhouseEffectGlobe' },
  { id: 'greenhouse_effect_simulator', name: 'Effect Simulator', icon: '&#x2699;&#xFE0F;', category: 'greenhouse', importPath: './machines/greenhouse_effect_simulator.js', importName: 'createGreenhouseEffectSimulator' },
  { id: 'gym_cable_weight_stack', name: 'Cable Weight Stack', icon: '&#x2699;&#xFE0F;', category: 'gym', importPath: './machines/gym_cable_weight_stack.js', importName: 'createCableWeightStack' },
  { id: 'gym_elliptical_trainer', name: 'Elliptical Trainer', icon: '&#x2699;&#xFE0F;', category: 'gym', importPath: './machines/gym_elliptical_trainer.js', importName: 'createEllipticalTrainer' },
  { id: 'gym_magnetic_rowing_machine', name: 'Magnetic Rowing Machine', icon: '&#x2699;&#xFE0F;', category: 'gym', importPath: './machines/gym_magnetic_rowing_machine.js', importName: 'createRowingMachine' },
  { id: 'gym_motorized_treadmill', name: 'Motorized Treadmill', icon: '&#x2699;&#xFE0F;', category: 'gym', importPath: './machines/gym_motorized_treadmill.js', importName: 'createTreadmill' },
  { id: 'gym_spin_bike', name: 'Spin Bike', icon: '&#x2699;&#xFE0F;', category: 'gym', importPath: './machines/gym_spin_bike.js', importName: 'createSpinBike' },
  { id: 'hall_effect_thruster', name: 'Hall Effect Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/hall_effect_thruster.js', importName: 'createHallEffectThruster' },
  { id: 'heavy_machinery_bulldozer', name: 'Machinery Bulldozer', icon: '&#x2699;&#xFE0F;', category: 'heavy', importPath: './machines/heavy_machinery_bulldozer.js', importName: 'createBulldozer' },
  { id: 'heavy_machinery_dump_truck', name: 'Machinery Dump Truck', icon: '&#x2699;&#xFE0F;', category: 'heavy', importPath: './machines/heavy_machinery_dump_truck.js', importName: 'createDumpTruck' },
  { id: 'heavy_machinery_excavator', name: 'Machinery Excavator', icon: '&#x2699;&#xFE0F;', category: 'heavy', importPath: './machines/heavy_machinery_excavator.js', importName: 'createExcavator' },
  { id: 'heavy_machinery_tbm', name: 'Machinery Tbm', icon: '&#x2699;&#xFE0F;', category: 'heavy', importPath: './machines/heavy_machinery_tbm.js', importName: 'createTBM' },
  { id: 'heavy_machinery_tower_crane', name: 'Machinery Tower Crane', icon: '&#x2699;&#xFE0F;', category: 'heavy', importPath: './machines/heavy_machinery_tower_crane.js', importName: 'createTowerCrane' },
  { id: 'helicopter_main_rotor', name: 'Main Rotor', icon: '&#x2699;&#xFE0F;', category: 'helicopter', importPath: './machines/helicopter_main_rotor.js', importName: 'createMainRotor' },
  { id: 'helicopter_skid_dampener', name: 'Skid Dampener', icon: '&#x2699;&#xFE0F;', category: 'helicopter', importPath: './machines/helicopter_skid_dampener.js', importName: 'createSkidDampener' },
  { id: 'helicopter_swashplate', name: 'Swashplate', icon: '&#x2699;&#xFE0F;', category: 'helicopter', importPath: './machines/helicopter_swashplate.js', importName: 'createSwashplate' },
  { id: 'helicopter_tail_rotor', name: 'Tail Rotor', icon: '&#x2699;&#xFE0F;', category: 'helicopter', importPath: './machines/helicopter_tail_rotor.js', importName: 'createTailRotor' },
  { id: 'helicopter_turboshaft_engine', name: 'Turboshaft Engine', icon: '&#x2699;&#xFE0F;', category: 'helicopter', importPath: './machines/helicopter_turboshaft_engine.js', importName: 'createTurboshaftEngine' },
  { id: 'heliophysics_cme_tracker', name: 'Cme Tracker', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_cme_tracker.js', importName: 'createCMETracker' },
  { id: 'heliophysics_heliospheric_imager', name: 'Heliospheric Imager', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_heliospheric_imager.js', importName: 'createHeliosphericImager' },
  { id: 'heliophysics_magnetosphere_mapper', name: 'Magnetosphere Mapper', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_magnetosphere_mapper.js', importName: 'createMagnetosphereMapper' },
  { id: 'heliophysics_solar_flare_detector', name: 'Solar Flare Detector', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_solar_flare_detector.js', importName: 'createSolarFlareDetector' },
  { id: 'heliophysics_solar_wind_analyzer', name: 'Solar Wind Analyzer', icon: '&#x2699;&#xFE0F;', category: 'heliophysics', importPath: './machines/heliophysics_solar_wind_analyzer.js', importName: 'createSolarWindAnalyzer' },
  { id: 'histology_embedding_center', name: 'Embedding Center', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_embedding_center.js', importName: 'createHistologyEmbeddingCenter' },
  { id: 'histology_light_microscope', name: 'Light Microscope', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_light_microscope.js', importName: 'createHistologyLightMicroscope' },
  { id: 'histology_microtome', name: 'Microtome', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_microtome.js', importName: 'createHistologyMicrotome' },
  { id: 'histology_slide_stainer', name: 'Slide Stainer', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_slide_stainer.js', importName: 'createHistologySlideStainer' },
  { id: 'histology_tissue_processor', name: 'Tissue Processor', icon: '&#x2699;&#xFE0F;', category: 'histology', importPath: './machines/histology_tissue_processor.js', importName: 'createHistologyTissueProcessor' },
  { id: 'historical_ballista', name: 'Ballista', icon: '&#x2699;&#xFE0F;', category: 'historical', importPath: './machines/historical_ballista.js', importName: 'createBallista' },
  { id: 'historical_battering_ram', name: 'Battering Ram', icon: '&#x2699;&#xFE0F;', category: 'historical', importPath: './machines/historical_battering_ram.js', importName: 'createBatteringRam' },
  { id: 'historical_catapult', name: 'Catapult', icon: '&#x2699;&#xFE0F;', category: 'historical', importPath: './machines/historical_catapult.js', importName: 'createCatapult' },
  { id: 'historical_siege_tower', name: 'Siege Tower', icon: '&#x2699;&#xFE0F;', category: 'historical', importPath: './machines/historical_siege_tower.js', importName: 'createSiegeTower' },
  { id: 'historical_trebuchet', name: 'Trebuchet', icon: '&#x2699;&#xFE0F;', category: 'historical', importPath: './machines/historical_trebuchet.js', importName: 'createTrebuchet' },
  { id: 'hiv_virus_infection', name: 'Virus Infection', icon: '&#x2699;&#xFE0F;', category: 'hiv', importPath: './machines/hiv_virus_infection.js', importName: 'createHIVInfection' },
  { id: 'hohmann_transfer', name: 'Transfer', icon: '&#x2699;&#xFE0F;', category: 'hohmann', importPath: './machines/hohmann_transfer.js', importName: 'createHohmannTransferOrbit' },
  { id: 'honey_bee_hive_social', name: 'Bee Hive Social', icon: '&#x2699;&#xFE0F;', category: 'honey', importPath: './machines/honey_bee_hive_social.js', importName: 'createHoneyBeeHive' },
  { id: 'horology_astrolabe', name: 'Astrolabe', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_astrolabe.js', importName: 'createAstrolabe' },
  { id: 'horology_cuckoo_clock', name: 'Cuckoo Clock', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_cuckoo_clock.js', importName: 'createCuckooClock' },
  { id: 'horology_grandfather_clock', name: 'Grandfather Clock', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_grandfather_clock.js', importName: 'createGrandfatherClock' },
  { id: 'horology_marine_chronometer', name: 'Marine Chronometer', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_marine_chronometer.js', importName: 'createMarineChronometer' },
  { id: 'horology_tourbillon', name: 'Tourbillon', icon: '&#x2699;&#xFE0F;', category: 'horology', importPath: './machines/horology_tourbillon.js', importName: 'createTourbillon' },
  { id: 'human_heart_pumping', name: 'Heart Pumping', icon: '&#x2699;&#xFE0F;', category: 'human', importPath: './machines/human_heart_pumping.js', importName: 'createHumanHeart' },
  { id: 'hvac_cooling_tower', name: 'Cooling Tower', icon: '&#x2699;&#xFE0F;', category: 'hvac', importPath: './machines/hvac_cooling_tower.js', importName: 'createCoolingTower' },
  { id: 'hvac_heat_pump', name: 'Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'hvac', importPath: './machines/hvac_heat_pump.js', importName: 'createHeatPump' },
  { id: 'hvac_industrial_chiller', name: 'Industrial Chiller', icon: '&#x2699;&#xFE0F;', category: 'hvac', importPath: './machines/hvac_industrial_chiller.js', importName: 'createIndustrialChiller' },
  { id: 'hvac_refrigeration_cycle', name: 'Refrigeration Cycle', icon: '&#x2699;&#xFE0F;', category: 'hvac', importPath: './machines/hvac_refrigeration_cycle.js', importName: 'createRefrigerationCycle' },
  { id: 'hvac_split_air_conditioner', name: 'Split Air Conditioner', icon: '&#x2699;&#xFE0F;', category: 'hvac', importPath: './machines/hvac_split_air_conditioner.js', importName: 'createAirConditioner' },
  { id: 'hydroponic_grow_system', name: 'Grow System', icon: '&#x2699;&#xFE0F;', category: 'hydroponic', importPath: './machines/hydroponic_grow_system.js', importName: 'createHydroponicGrowSystem' },
  { id: 'hydro_francis_turbine', name: 'Francis Turbine', icon: '&#x2699;&#xFE0F;', category: 'hydro', importPath: './machines/hydro_francis_turbine.js', importName: 'createFrancisTurbine' },
  { id: 'hydro_kaplan_turbine', name: 'Kaplan Turbine', icon: '&#x2699;&#xFE0F;', category: 'hydro', importPath: './machines/hydro_kaplan_turbine.js', importName: 'createKaplanTurbine' },
  { id: 'hydro_pelton_wheel', name: 'Pelton Wheel', icon: '&#x2699;&#xFE0F;', category: 'hydro', importPath: './machines/hydro_pelton_wheel.js', importName: 'createPeltonWheel' },
  { id: 'hydro_penstock_valve', name: 'Penstock Valve', icon: '&#x2699;&#xFE0F;', category: 'hydro', importPath: './machines/hydro_penstock_valve.js', importName: 'createPenstockValve' },
  { id: 'hydro_sluice_gate', name: 'Sluice Gate', icon: '&#x2699;&#xFE0F;', category: 'hydro', importPath: './machines/hydro_sluice_gate.js', importName: 'createSluiceGate' },
  { id: 'ice_core_paleoclimate_drill', name: 'Core Paleoclimate Drill', icon: '&#x2699;&#xFE0F;', category: 'ice', importPath: './machines/ice_core_paleoclimate_drill.js', importName: 'createIceCorePaleoclimateDrill' },
  { id: 'induction_motor', name: 'Motor', icon: '&#x2699;&#xFE0F;', category: 'induction', importPath: './machines/induction_motor.js', importName: 'createInductionMotor' },
  { id: 'inertial_navigation_system', name: 'Navigation System', icon: '&#x2699;&#xFE0F;', category: 'inertial', importPath: './machines/inertial_navigation_system.js', importName: 'createInertialNavigationSystem' },
  { id: 'inorganic_coordination_complex', name: 'Coordination Complex', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_coordination_complex.js', importName: 'createCoordinationComplex' },
  { id: 'inorganic_crystal_lattice', name: 'Crystal Lattice', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_crystal_lattice.js', importName: 'createCrystalLattice' },
  { id: 'inorganic_metal_organic_framework', name: 'Metal Organic Framework', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_metal_organic_framework.js', importName: 'createMetalOrganicFramework' },
  { id: 'inorganic_zeolite_framework', name: 'Zeolite Framework', icon: '&#x2699;&#xFE0F;', category: 'inorganic', importPath: './machines/inorganic_zeolite_framework.js', importName: 'createZeoliteFramework' },
  { id: 'ion_thruster', name: 'Thruster', icon: '&#x2699;&#xFE0F;', category: 'ion', importPath: './machines/ion_thruster.js', importName: 'createIonThruster' },
  { id: 'io_dma_controller', name: 'Dma Controller', icon: '&#x2699;&#xFE0F;', category: 'io', importPath: './machines/io_dma_controller.js', importName: 'createIoDmaController' },
  { id: 'ipc_message_queue', name: 'Message Queue', icon: '&#x2699;&#xFE0F;', category: 'ipc', importPath: './machines/ipc_message_queue.js', importName: 'createIpcMessageQueue' },
  { id: 'josephson_junction', name: 'Josephson Junction', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/josephson_junction.js', importName: 'createJosephsonJunction' },
  { id: 'karyotype_chromosome_map', name: 'Chromosome Map', icon: '&#x2699;&#xFE0F;', category: 'karyotype', importPath: './machines/karyotype_chromosome_map.js', importName: 'createKaryotype' },
  { id: 'kidney_nephron_filtration', name: 'Nephron Filtration', icon: '&#x2699;&#xFE0F;', category: 'kidney', importPath: './machines/kidney_nephron_filtration.js', importName: 'createKidneyNephron' },
  { id: 'kitchen_espresso_machine', name: 'Espresso Machine', icon: '&#x2699;&#xFE0F;', category: 'kitchen', importPath: './machines/kitchen_espresso_machine.js', importName: 'createEspressoMachine' },
  { id: 'kitchen_microwave_oven', name: 'Kitchen Microwave Oven', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/kitchen_microwave_oven.js', importName: 'createMicrowaveOven' },
  { id: 'kitchen_refrigerator_compressor', name: 'Refrigerator Compressor', icon: '&#x2699;&#xFE0F;', category: 'kitchen', importPath: './machines/kitchen_refrigerator_compressor.js', importName: 'createRefrigeratorCompressor' },
  { id: 'kitchen_stand_mixer', name: 'Stand Mixer', icon: '&#x2699;&#xFE0F;', category: 'kitchen', importPath: './machines/kitchen_stand_mixer.js', importName: 'createStandMixer' },
  { id: 'lagrange_points', name: 'Points', icon: '&#x2699;&#xFE0F;', category: 'lagrange', importPath: './machines/lagrange_points.js', importName: 'createLagrangePointsSystem' },
  { id: 'linac_machine', name: 'Machine', icon: '&#x2699;&#xFE0F;', category: 'linac', importPath: './machines/linac_machine.js', importName: 'createMedicalLinearAccelerator' },
  { id: 'lipid_bilayer_membrane', name: 'Bilayer Membrane', icon: '&#x2699;&#xFE0F;', category: 'lipid', importPath: './machines/lipid_bilayer_membrane.js', importName: 'createLipidBilayer' },
  { id: 'locomotive_diesel_electric_generator', name: 'Diesel Electric Generator', icon: '&#x2699;&#xFE0F;', category: 'locomotive', importPath: './machines/locomotive_diesel_electric_generator.js', importName: 'createDieselElectricGenerator' },
  { id: 'locomotive_maglev_undercarriage', name: 'Maglev Undercarriage', icon: '&#x2699;&#xFE0F;', category: 'locomotive', importPath: './machines/locomotive_maglev_undercarriage.js', importName: 'createMaglevUndercarriage' },
  { id: 'locomotive_pantograph_assembly', name: 'Pantograph Assembly', icon: '&#x2699;&#xFE0F;', category: 'locomotive', importPath: './machines/locomotive_pantograph_assembly.js', importName: 'createPantographAssembly' },
  { id: 'locomotive_rail_switch_mechanism', name: 'Rail Switch Mechanism', icon: '&#x2699;&#xFE0F;', category: 'locomotive', importPath: './machines/locomotive_rail_switch_mechanism.js', importName: 'createRailSwitchMechanism' },
  { id: 'locomotive_steam_drive_wheel', name: 'Steam Drive Wheel', icon: '&#x2699;&#xFE0F;', category: 'locomotive', importPath: './machines/locomotive_steam_drive_wheel.js', importName: 'createSteamDriveWheel' },
  { id: 'magnetohydrodynamics_generator', name: 'Generator', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_generator.js', importName: 'createMHDGenerator' },
  { id: 'magnetohydrodynamics_plasma_thruster', name: 'Plasma Thruster', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_plasma_thruster.js', importName: 'createPlasmaThruster' },
  { id: 'magnetohydrodynamics_pump', name: 'Pump', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_pump.js', importName: 'createMHDPump' },
  { id: 'magnetohydrodynamics_stellarator', name: 'Stellarator', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_stellarator.js', importName: 'createStellarator' },
  { id: 'magnetohydrodynamics_tokamak', name: 'Tokamak', icon: '&#x2699;&#xFE0F;', category: 'magnetohydrodynamics', importPath: './machines/magnetohydrodynamics_tokamak.js', importName: 'createTokamakReactor' },
  { id: 'magnonics_crystal', name: 'Crystal', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_crystal.js', importName: 'createMagnonicCrystal' },
  { id: 'magnonics_logic_gate', name: 'Logic Gate', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_logic_gate.js', importName: 'createMagnonicLogicGate' },
  { id: 'magnonics_magnon_transistor', name: 'Magnon Transistor', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_magnon_transistor.js', importName: 'createMagnonTransistor' },
  { id: 'magnonics_spin_torque_oscillator', name: 'Spin Torque Oscillator', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_spin_torque_oscillator.js', importName: 'createSpinTorqueOscillator' },
  { id: 'magnonics_spin_waveguide', name: 'Spin Waveguide', icon: '&#x2699;&#xFE0F;', category: 'magnonics', importPath: './machines/magnonics_spin_waveguide.js', importName: 'createSpinWaveguide' },
  { id: 'manual_transmission', name: 'Transmission', icon: '&#x2699;&#xFE0F;', category: 'manual', importPath: './machines/manual_transmission.js', importName: 'createManualTransmission' },
  { id: 'marine_biology_jellyfish', name: 'Biology Jellyfish', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_biology_jellyfish.js', importName: 'createJellyfish' },
  { id: 'marine_biology_plankton', name: 'Biology Plankton', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_biology_plankton.js', importName: 'createPlankton' },
  { id: 'marine_biology_shark', name: 'Biology Shark', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_biology_shark.js', importName: 'createShark' },
  { id: 'marine_biology_submersible', name: 'Biology Submersible', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_biology_submersible.js', importName: 'createSubmersible' },
  { id: 'marine_container_ship', name: 'Container Ship', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_container_ship.js', importName: 'createContainerShip' },
  { id: 'marine_food_web', name: 'Food Web', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_food_web.js', importName: 'createMarineFoodWeb' },
  { id: 'marine_hovercraft', name: 'Hovercraft', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_hovercraft.js', importName: 'createHovercraft' },
  { id: 'marine_hydrofoil', name: 'Hydrofoil', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_hydrofoil.js', importName: 'createHydrofoil' },
  { id: 'marine_submarine', name: 'Submarine', icon: '&#x2699;&#xFE0F;', category: 'marine', importPath: './machines/marine_submarine.js', importName: 'createSubmarine' },
  { id: 'mars_rover_descent_stage_crane', name: 'Rover Descent Stage Crane', icon: '&#x2699;&#xFE0F;', category: 'mars', importPath: './machines/mars_rover_descent_stage_crane.js', importName: 'createDescentStageCrane' },
  { id: 'mars_rover_multi_mission_rtg', name: 'Rover Multi Mission Rtg', icon: '&#x2699;&#xFE0F;', category: 'mars', importPath: './machines/mars_rover_multi_mission_rtg.js', importName: 'createMultiMissionRTG' },
  { id: 'mars_rover_panoramic_camera_mast', name: 'Rover Panoramic Camera Mast', icon: '&#x2699;&#xFE0F;', category: 'mars', importPath: './machines/mars_rover_panoramic_camera_mast.js', importName: 'createPanoramicCameraMast' },
  { id: 'mars_rover_rocker_bogie', name: 'Rover Rocker Bogie', icon: '&#x2699;&#xFE0F;', category: 'mars', importPath: './machines/mars_rover_rocker_bogie.js', importName: 'createRockerBogie' },
  { id: 'mars_rover_sample_return_drill', name: 'Rover Sample Return Drill', icon: '&#x2699;&#xFE0F;', category: 'mars', importPath: './machines/mars_rover_sample_return_drill.js', importName: 'createSampleReturnDrill' },
  { id: 'mechatronics_hexapod', name: 'Hexapod', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_hexapod.js', importName: 'createHexapod' },
  { id: 'mechatronics_quadcopter', name: 'Quadcopter', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_quadcopter.js', importName: 'createQuadcopter' },
  { id: 'mechatronics_robotic_hand', name: 'Robotic Hand', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_robotic_hand.js', importName: 'createRoboticHand' },
  { id: 'mechatronics_segway', name: 'Segway', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_segway.js', importName: 'createSegway' },
  { id: 'mechatronics_stewart_platform', name: 'Stewart Platform', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_stewart_platform.js', importName: 'createStewartPlatform' },
  { id: 'mech_camshaft_follower', name: 'Camshaft Follower', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_camshaft_follower.js', importName: 'createCamshaftFollower' },
  { id: 'mech_centrifugal_pump', name: 'Centrifugal Pump', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_centrifugal_pump.js', importName: 'createCentrifugalPump' },
  { id: 'mech_differential_gear', name: 'Differential Gear', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_differential_gear.js', importName: 'createDifferentialGear' },
  { id: 'mech_four_stroke_engine_cylinder', name: 'Four Stroke Engine Cylinder', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_four_stroke_engine_cylinder.js', importName: 'createFourStrokeEngineCylinder' },
  { id: 'mech_geneva_drive', name: 'Geneva Drive', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_geneva_drive.js', importName: 'createGenevaDrive' },
  { id: 'mech_harmonic_drive', name: 'Harmonic Drive', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_harmonic_drive.js', importName: 'createHarmonicDrive' },
  { id: 'mech_hydraulic_excavator_arm', name: 'Hydraulic Excavator Arm', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_hydraulic_excavator_arm.js', importName: 'createHydraulicExcavatorArm' },
  { id: 'mech_planetary_gearbox', name: 'Planetary Gearbox', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_planetary_gearbox.js', importName: 'createPlanetaryGearbox' },
  { id: 'mech_rack_and_pinion', name: 'Rack And Pinion', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_rack_and_pinion.js', importName: 'createRackAndPinion' },
  { id: 'mech_roots_blower', name: 'Roots Blower', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_roots_blower.js', importName: 'createRootsBlower' },
  { id: 'mech_scotch_yoke', name: 'Scotch Yoke', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_scotch_yoke.js', importName: 'createScotchYoke' },
  { id: 'mech_scroll_compressor', name: 'Scroll Compressor', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_scroll_compressor.js', importName: 'createScrollCompressor' },
  { id: 'mech_universal_joint', name: 'Universal Joint', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_universal_joint.js', importName: 'createUniversalJoint' },
  { id: 'mech_wankel_engine', name: 'Wankel Engine', icon: '&#x2699;&#xFE0F;', category: 'mech', importPath: './machines/mech_wankel_engine.js', importName: 'createWankelEngine' },
  { id: 'megastructures_dyson_swarm_node', name: 'Dyson Swarm Node', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_dyson_swarm_node.js', importName: 'createDysonSwarmNode' },
  { id: 'megastructures_oneill_cylinder', name: 'Oneill Cylinder', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_oneill_cylinder.js', importName: 'createONeillCylinder' },
  { id: 'megastructures_space_elevator', name: 'Space Elevator', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_space_elevator.js', importName: 'createSpaceElevator' },
  { id: 'megastructures_stanford_torus', name: 'Stanford Torus', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_stanford_torus.js', importName: 'createStanfordTorus' },
  { id: 'megastructures_starship_docking_bay', name: 'Starship Docking Bay', icon: '&#x2699;&#xFE0F;', category: 'megastructures', importPath: './machines/megastructures_starship_docking_bay.js', importName: 'createStarshipDockingBay' },
  { id: 'meiosis_crossing_over', name: 'Crossing Over', icon: '&#x2699;&#xFE0F;', category: 'meiosis', importPath: './machines/meiosis_crossing_over.js', importName: 'createMeiosisCrossingOver' },
  { id: 'mems_gyroscope', name: 'Gyroscope', icon: '&#x2699;&#xFE0F;', category: 'mems', importPath: './machines/mems_gyroscope.js', importName: 'createMEMSGyroscope' },
  { id: 'metamaterials_auxetic_structure', name: 'Metamaterials Auxetic Structure', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/metamaterials_auxetic_structure.js', importName: 'createAuxeticStructure' },
  { id: 'metamaterials_photonic_crystal', name: 'Metamaterials Photonic Crystal', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/metamaterials_photonic_crystal.js', importName: 'createPhotonicCrystalWaveguide' },
  { id: 'metamaterials_split_ring_resonator', name: 'Metamaterials Split Ring Resonator', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/metamaterials_split_ring_resonator.js', importName: 'createSplitRingResonatorArray' },
  { id: 'metamaterials_thermal_cloak', name: 'Metamaterials Thermal Cloak', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/metamaterials_thermal_cloak.js', importName: 'createThermalCloak' },
  { id: 'metamaterial_sound_absorber', name: 'Metamaterial Sound Absorber', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/metamaterial_sound_absorber.js', importName: 'createMetamaterialSoundAbsorber' },
  { id: 'meteorology_anemometer', name: 'Anemometer', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_anemometer.js', importName: 'createAnemometer' },
  { id: 'meteorology_barograph', name: 'Barograph', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_barograph.js', importName: 'createBarograph' },
  { id: 'meteorology_cup_anemometer', name: 'Cup Anemometer', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_cup_anemometer.js', importName: 'createCupAnemometer' },
  { id: 'meteorology_doppler_radar', name: 'Doppler Radar', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_doppler_radar.js', importName: 'createDopplerRadar' },
  { id: 'meteorology_radiosonde', name: 'Radiosonde', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_radiosonde.js', importName: 'createRadiosonde' },
  { id: 'meteorology_seismograph', name: 'Seismograph', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_seismograph.js', importName: 'createSeismograph' },
  { id: 'meteorology_weather_radar', name: 'Weather Radar', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_radar.js', importName: 'createWeatherRadar' },
  { id: 'meteorology_weather_satellite', name: 'Weather Satellite', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_satellite.js', importName: 'createWeatherSatellite' },
  { id: 'meteorology_weather_station', name: 'Weather Station', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_station.js', importName: 'createWeatherStation' },
  { id: 'microwave_coaxial_line', name: 'Microwave Coaxial Line', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/microwave_coaxial_line.js', importName: 'createMicrowaveCoaxialLine' },
  { id: 'micro_gears_assembly', name: 'Gears Assembly', icon: '&#x2699;&#xFE0F;', category: 'micro', importPath: './machines/micro_gears_assembly.js', importName: 'createMicroGearsAssembly' },
  { id: 'mining_bucket_wheel', name: 'Bucket Wheel', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_bucket_wheel.js', importName: 'createBucketWheel' },
  { id: 'mining_bucket_wheel_excavator', name: 'Bucket Wheel Excavator', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_bucket_wheel_excavator.js', importName: 'createBucketWheelExcavator' },
  { id: 'mining_continuous_miner', name: 'Continuous Miner', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_continuous_miner.js', importName: 'createContinuousMiner' },
  { id: 'mining_dragline_excavator', name: 'Dragline Excavator', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_dragline_excavator.js', importName: 'createDragline' },
  { id: 'mining_jaw_crusher', name: 'Jaw Crusher', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_jaw_crusher.js', importName: 'createJawCrusher' },
  { id: 'mining_jaw_rock_crusher', name: 'Jaw Rock Crusher', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_jaw_rock_crusher.js', importName: 'createJawRockCrusher' },
  { id: 'mining_mine_shaft_elevator', name: 'Mine Shaft Elevator', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_mine_shaft_elevator.js', importName: 'createMineShaftElevator' },
  { id: 'mining_shuttle_car', name: 'Shuttle Car', icon: '&#x2699;&#xFE0F;', category: 'mining', importPath: './machines/mining_shuttle_car.js', importName: 'createShuttleCar' },
  { id: 'mitchell_camera_movement', name: 'Camera Movement', icon: '&#x2699;&#xFE0F;', category: 'mitchell', importPath: './machines/mitchell_camera_movement.js', importName: 'createMitchellCamera' },
  { id: 'molecules', name: 'Molecules', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/molecules.js', importName: 'createMolecules' },
  { id: 'mri_scanner', name: 'Scanner', icon: '&#x2699;&#xFE0F;', category: 'mri', importPath: './machines/mri_scanner.js', importName: 'createMRIScanner' },
  { id: 'music_acoustic_drum_kit', name: 'Music Acoustic Drum Kit', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/music_acoustic_drum_kit.js', importName: 'createAcousticDrumKit' },
  { id: 'music_electric_guitar', name: 'Electric Guitar', icon: '&#x2699;&#xFE0F;', category: 'music', importPath: './machines/music_electric_guitar.js', importName: 'createElectricGuitar' },
  { id: 'music_grand_piano', name: 'Grand Piano', icon: '&#x2699;&#xFE0F;', category: 'music', importPath: './machines/music_grand_piano.js', importName: 'createGrandPiano' },
  { id: 'music_moog_synthesizer', name: 'Moog Synthesizer', icon: '&#x2699;&#xFE0F;', category: 'music', importPath: './machines/music_moog_synthesizer.js', importName: 'createMoogSynthesizer' },
  { id: 'music_pipe_organ', name: 'Pipe Organ', icon: '&#x2699;&#xFE0F;', category: 'music', importPath: './machines/music_pipe_organ.js', importName: 'createPipeOrgan' },
  { id: 'nanomedicine_drug_delivery_liposome', name: 'Drug Delivery Liposome', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_drug_delivery_liposome.js', importName: 'createDrugDeliveryLiposome' },
  { id: 'nanomedicine_gold_nanoshell', name: 'Gold Nanoshell', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_gold_nanoshell.js', importName: 'createGoldNanoshell' },
  { id: 'nanomedicine_magnetic_nanoparticle_swarm', name: 'Magnetic Nanoparticle Swarm', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_magnetic_nanoparticle_swarm.js', importName: 'createMagneticNanoparticleSwarm' },
  { id: 'nanomedicine_targeted_exosome', name: 'Targeted Exosome', icon: '&#x2699;&#xFE0F;', category: 'nanomedicine', importPath: './machines/nanomedicine_targeted_exosome.js', importName: 'createTargetedExosome' },
  { id: 'nanotechnology_carbon_nanotube', name: 'Nanotechnology Carbon Nanotube', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/nanotechnology_carbon_nanotube.js', importName: 'createCarbonNanotube' },
  { id: 'nanotechnology_dna_origami', name: 'Dna Origami', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_dna_origami.js', importName: 'createDNAOrigami' },
  { id: 'nanotechnology_graphene', name: 'Graphene', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_graphene.js', importName: 'createGraphene' },
  { id: 'nanotechnology_molecular_motor', name: 'Molecular Motor', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_molecular_motor.js', importName: 'createMolecularMotor' },
  { id: 'nanotechnology_nanobot', name: 'Nanobot', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nanotechnology_nanobot.js', importName: 'createNanobot' },
  { id: 'nano_blood_swimmer', name: 'Blood Swimmer', icon: '&#x2699;&#xFE0F;', category: 'nano', importPath: './machines/nano_blood_swimmer.js', importName: 'createNanoBloodSwimmer' },
  { id: 'nano_carbon_nanotube_actuator', name: 'Nano Carbon Nanotube Actuator', icon: '&#x2699;&#xFE0F;', category: 'carbon_capture', importPath: './machines/nano_carbon_nanotube_actuator.js', importName: 'createCarbonNanotubeActuator' },
  { id: 'nano_dna_bot', name: 'Dna Bot', icon: '&#x2699;&#xFE0F;', category: 'nano', importPath: './machines/nano_dna_bot.js', importName: 'createDNANanobot' },
  { id: 'nano_drug_delivery', name: 'Drug Delivery', icon: '&#x2699;&#xFE0F;', category: 'nano', importPath: './machines/nano_drug_delivery.js', importName: 'createDrugDeliveryVehicle' },
  { id: 'nano_flagellar_motor', name: 'Flagellar Motor', icon: '&#x2699;&#xFE0F;', category: 'nano', importPath: './machines/nano_flagellar_motor.js', importName: 'createFlagellarMotor' },
  { id: 'nano_magnetic_microrobot', name: 'Magnetic Microrobot', icon: '&#x2699;&#xFE0F;', category: 'nano', importPath: './machines/nano_magnetic_microrobot.js', importName: 'createMagneticMicrorobot' },
  { id: 'networking_datacenter_rack', name: 'Datacenter Rack', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/networking_datacenter_rack.js', importName: 'createDataCenterRack' },
  { id: 'networking_router', name: 'Router', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/networking_router.js', importName: 'createRouterModel' },
  { id: 'networking_switch', name: 'Switch', icon: '&#x2699;&#xFE0F;', category: 'networking', importPath: './machines/networking_switch.js', importName: 'createSwitchModel' },
  { id: 'network_5g_cell_tower', name: '5G Cell Tower', icon: '&#x2699;&#xFE0F;', category: 'network', importPath: './machines/network_5g_cell_tower.js', importName: 'createCellTower' },
  { id: 'network_datacenter_server_rack', name: 'Datacenter Server Rack', icon: '&#x2699;&#xFE0F;', category: 'network', importPath: './machines/network_datacenter_server_rack.js', importName: 'createDatacenterServerRack' },
  { id: 'network_high_speed_switch', name: 'High Speed Switch', icon: '&#x2699;&#xFE0F;', category: 'network', importPath: './machines/network_high_speed_switch.js', importName: 'createHighSpeedNetworkSwitch' },
  { id: 'network_satellite_dish_array', name: 'Satellite Dish Array', icon: '&#x2699;&#xFE0F;', category: 'network', importPath: './machines/network_satellite_dish_array.js', importName: 'createSatelliteDishArray' },
  { id: 'network_subsea_fiber_cable', name: 'Subsea Fiber Cable', icon: '&#x2699;&#xFE0F;', category: 'network', importPath: './machines/network_subsea_fiber_cable.js', importName: 'createSubseaFiberCable' },
  { id: 'neural_network', name: 'Network', icon: '&#x2699;&#xFE0F;', category: 'neural', importPath: './machines/neural_network.js', importName: 'createDeepNeuralNetwork' },
  { id: 'neuron', name: 'Neuron', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/neuron.js', importName: 'createNeuron' },
  { id: 'neutrino_beam_generator', name: 'Neutrino Beam Generator', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_beam_generator.js', importName: 'createNeutrinoBeamGenerator' },
  { id: 'neutrino_dark_side_observatory', name: 'Neutrino Dark Side Observatory', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_dark_side_observatory.js', importName: 'createDarkSideObservatory' },
  { id: 'neutrino_icecube_string', name: 'Neutrino Icecube String', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_icecube_string.js', importName: 'createIceCubeDetector' },
  { id: 'neutrino_liquid_argon_tpc', name: 'Neutrino Liquid Argon Tpc', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_liquid_argon_tpc.js', importName: 'createLiquidArgonTPC' },
  { id: 'neutrino_physics_antineutrino_reactor', name: 'Neutrino Physics Antineutrino Reactor', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_physics_antineutrino_reactor.js', importName: 'createAntineutrinoReactor' },
  { id: 'neutrino_physics_cherenkov_detector', name: 'Neutrino Physics Cherenkov Detector', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_physics_cherenkov_detector.js', importName: 'createCherenkovDetector' },
  { id: 'neutrino_physics_oscillation_chamber', name: 'Neutrino Physics Oscillation Chamber', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_physics_oscillation_chamber.js', importName: 'createOscillationChamber' },
  { id: 'neutrino_physics_sterile_neutrino_trap', name: 'Neutrino Physics Sterile Neutrino Trap', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_physics_sterile_neutrino_trap.js', importName: 'createSterileNeutrinoTrap' },
  { id: 'neutrino_physics_supernova_burst', name: 'Neutrino Physics Supernova Burst', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_physics_supernova_burst.js', importName: 'createSupernovaNeutrinoBurst' },
  { id: 'neutrino_subterranean_receiver', name: 'Neutrino Subterranean Receiver', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/neutrino_subterranean_receiver.js', importName: 'createSubterraneanReceiver' },
  { id: 'next_gen_cell_tower', name: 'Gen Cell Tower', icon: '&#x2699;&#xFE0F;', category: 'next', importPath: './machines/next_gen_cell_tower.js', importName: 'createNextGenCellTower' },
  { id: 'nuclear_centrifuge_cascade', name: 'Centrifuge Cascade', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_centrifuge_cascade.js', importName: 'createNuclearCentrifugeCascade' },
  { id: 'nuclear_control_rod_drive', name: 'Control Rod Drive', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_control_rod_drive.js', importName: 'createControlRodDrive' },
  { id: 'nuclear_cooling_tower', name: 'Cooling Tower', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_cooling_tower.js', importName: 'createCoolingTower' },
  { id: 'nuclear_pwr_reactor', name: 'Pwr Reactor', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_pwr_reactor.js', importName: 'createPWR' },
  { id: 'nuclear_reactor', name: 'Reactor', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_reactor.js', importName: 'createNuclearReactor' },
  { id: 'nuclear_reprocessing_centrifuge', name: 'Reprocessing Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_reprocessing_centrifuge.js', importName: 'createReprocessingCentrifuge' },
  { id: 'nuclear_steam_generator', name: 'Steam Generator', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_steam_generator.js', importName: 'createSteamGenerator' },
  { id: 'nuclear_thermal_rocket', name: 'Thermal Rocket', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_thermal_rocket.js', importName: 'createNuclearThermalRocket' },
  { id: 'nuclear_tokamak_fusion_reactor', name: 'Tokamak Fusion Reactor', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_tokamak_fusion_reactor.js', importName: 'createNuclearTokamakFusionReactor' },
  { id: 'oceanography_buoy_sensor_array', name: 'Buoy Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_buoy_sensor_array.js', importName: 'createBuoySensorArray' },
  { id: 'oceanography_glider', name: 'Glider', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_glider.js', importName: 'createUnderwaterGlider' },
  { id: 'oceanography_roaming_submersible', name: 'Roaming Submersible', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_roaming_submersible.js', importName: 'createRoamingSubmersible' },
  { id: 'oceanography_seafloor_seismometer', name: 'Seafloor Seismometer', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_seafloor_seismometer.js', importName: 'createSeafloorSeismometer' },
  { id: 'oceanography_tidal_turbine', name: 'Tidal Turbine', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_tidal_turbine.js', importName: 'createTidalTurbine' },
  { id: 'ocean_bottom_seismometer', name: 'Bottom Seismometer', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_bottom_seismometer.js', importName: 'createOceanBottomSeismometer' },
  { id: 'ocean_ecosystem', name: 'Ecosystem', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_ecosystem.js', importName: 'createOceanEcosystem' },
  { id: 'ocean_geo_geothermal_heat_pump', name: 'Ocean Geothermal Heat Pump', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/ocean_geo_geothermal_heat_pump.js', importName: 'createGeothermalHeatPump' },
  { id: 'ocean_geo_otec_plant', name: 'Otec Plant', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_geo_otec_plant.js', importName: 'createOtecPlant' },
  { id: 'ocean_geo_salinity_gradient_generator', name: 'Salinity Gradient Generator', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_geo_salinity_gradient_generator.js', importName: 'createSalinityGradientGenerator' },
  { id: 'ocean_geo_tidal_turbine', name: 'Tidal Turbine', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_geo_tidal_turbine.js', importName: 'createTidalTurbine' },
  { id: 'ocean_geo_wave_energy_converter', name: 'Wave Energy Converter', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_geo_wave_energy_converter.js', importName: 'createWaveEnergyConverter' },
  { id: 'ocean_thermohaline_circulation', name: 'Thermohaline Circulation', icon: '&#x2699;&#xFE0F;', category: 'ocean', importPath: './machines/ocean_thermohaline_circulation.js', importName: 'createOceanThermohalineCirculation' },
  { id: 'oil_drilling_rig', name: 'Drilling Rig', icon: '&#x2699;&#xFE0F;', category: 'oil', importPath: './machines/oil_drilling_rig.js', importName: 'createOilDrillingRig' },
  { id: 'oncology_cyberknife', name: 'Cyberknife', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/oncology_cyberknife.js', importName: 'createCyberKnife' },
  { id: 'oncology_gamma_knife', name: 'Gamma Knife', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/oncology_gamma_knife.js', importName: 'createGammaKnife' },
  { id: 'oncology_linac', name: 'Linac', icon: '&#x2699;&#xFE0F;', category: 'oncology', importPath: './machines/oncology_linac.js', importName: 'createLinac' },
  { id: 'operating_systems_context_switch', name: 'Systems Context Switch', icon: '&#x2699;&#xFE0F;', category: 'operating', importPath: './machines/operating_systems_context_switch.js', importName: 'createContextSwitch' },
  { id: 'operating_systems_cpu_scheduler', name: 'Systems Cpu Scheduler', icon: '&#x2699;&#xFE0F;', category: 'operating', importPath: './machines/operating_systems_cpu_scheduler.js', importName: 'createCPUScheduler' },
  { id: 'operating_systems_deadlock_detection', name: 'Systems Deadlock Detection', icon: '&#x2699;&#xFE0F;', category: 'operating', importPath: './machines/operating_systems_deadlock_detection.js', importName: 'createDeadlockDetection' },
  { id: 'operating_systems_file_system', name: 'Systems File System', icon: '&#x2699;&#xFE0F;', category: 'operating', importPath: './machines/operating_systems_file_system.js', importName: 'createFileSystemTree' },
  { id: 'operating_systems_memory_paging', name: 'Systems Memory Paging', icon: '&#x2699;&#xFE0F;', category: 'operating', importPath: './machines/operating_systems_memory_paging.js', importName: 'createMemoryPagingSystem' },
  { id: 'optical_interferometer', name: 'Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optical', importPath: './machines/optical_interferometer.js', importName: 'createOpticalInterferometer' },
  { id: 'optics_holographic_projector', name: 'Holographic Projector', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_holographic_projector.js', importName: 'createHolographicProjector' },
  { id: 'optics_laser_interferometer', name: 'Optics Laser Interferometer', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/optics_laser_interferometer.js', importName: 'createLaserInterferometer' },
  { id: 'optics_observatory_telescope', name: 'Observatory Telescope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_observatory_telescope.js', importName: 'createObservatoryTelescope' },
  { id: 'optics_optical_spectrometer', name: 'Optical Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_optical_spectrometer.js', importName: 'createOpticalSpectrometer' },
  { id: 'optics_scanning_electron_microscope', name: 'Scanning Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_scanning_electron_microscope.js', importName: 'createScanningElectronMicroscope' },
  { id: 'optics_spectrometer', name: 'Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_spectrometer.js', importName: 'createSpectrometer' },
  { id: 'optics_telescope_reflector', name: 'Telescope Reflector', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_telescope_reflector.js', importName: 'createReflectingTelescope' },
  { id: 'optogenetics_fiber_optic_cannula', name: 'Fiber Optic Cannula', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_fiber_optic_cannula.js', importName: 'createFiberOpticCannula' },
  { id: 'optogenetics_light_stimulation_array', name: 'Light Stimulation Array', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_light_stimulation_array.js', importName: 'createLightStimulationArray' },
  { id: 'optogenetics_neural_implant', name: 'Neural Implant', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_neural_implant.js', importName: 'createNeuralImplant' },
  { id: 'optogenetics_opsin_protein', name: 'Opsin Protein', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_opsin_protein.js', importName: 'createOpsinProtein' },
  { id: 'optogenetics_patch_clamp_fluorometer', name: 'Patch Clamp Fluorometer', icon: '&#x2699;&#xFE0F;', category: 'optogenetics', importPath: './machines/optogenetics_patch_clamp_fluorometer.js', importName: 'createPatchClampFluorometer' },
  { id: 'orbital_mechanics_hohmann_transfer', name: 'Mechanics Hohmann Transfer', icon: '&#x2699;&#xFE0F;', category: 'orbital', importPath: './machines/orbital_mechanics_hohmann_transfer.js', importName: 'createHohmannTransfer' },
  { id: 'orbital_mechanics_kepler_laws', name: 'Mechanics Kepler Laws', icon: '&#x2699;&#xFE0F;', category: 'orbital', importPath: './machines/orbital_mechanics_kepler_laws.js', importName: 'createKeplersLaws' },
  { id: 'orbital_mechanics_satellite_constellation', name: 'Mechanics Satellite Constellation', icon: '&#x2699;&#xFE0F;', category: 'orbital', importPath: './machines/orbital_mechanics_satellite_constellation.js', importName: 'createSatelliteConstellation' },
  { id: 'orbital_mechanics_three_body', name: 'Mechanics Three Body', icon: '&#x2699;&#xFE0F;', category: 'orbital', importPath: './machines/orbital_mechanics_three_body.js', importName: 'createThreeBodyProblem' },
  { id: 'orbital_mechanics_two_body', name: 'Mechanics Two Body', icon: '&#x2699;&#xFE0F;', category: 'orbital', importPath: './machines/orbital_mechanics_two_body.js', importName: 'createTwoBodyOrbit' },
  { id: 'orbital_resonance', name: 'Resonance', icon: '&#x2699;&#xFE0F;', category: 'orbital', importPath: './machines/orbital_resonance.js', importName: 'createOrbitalResonanceSystem' },
  { id: 'otec_plant', name: 'Plant', icon: '&#x2699;&#xFE0F;', category: 'otec', importPath: './machines/otec_plant.js', importName: 'createOtecPlant' },
  { id: 'outbreak-command-center', name: 'Outbreak-Command-Center', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/outbreak-command-center.js', importName: 'createOutbreakResponseCommandCenter' },
  { id: 'paleoclimatology_climate_chamber', name: 'Climate Chamber', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_climate_chamber.js', importName: 'createClimateChamber' },
  { id: 'paleoclimatology_dendrochronology_scanner', name: 'Dendrochronology Scanner', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_dendrochronology_scanner.js', importName: 'createDendrochronologyScanner' },
  { id: 'paleoclimatology_ice_core_drill', name: 'Ice Core Drill', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_ice_core_drill.js', importName: 'createIceCoreDrill' },
  { id: 'paleoclimatology_mass_spectrometer', name: 'Mass Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_mass_spectrometer.js', importName: 'createMassSpectrometer' },
  { id: 'paleoclimatology_sediment_corer', name: 'Sediment Corer', icon: '&#x2699;&#xFE0F;', category: 'paleoclimatology', importPath: './machines/paleoclimatology_sediment_corer.js', importName: 'createSedimentCorer' },
  { id: 'paleo_dig_site', name: 'Dig Site', icon: '&#x2699;&#xFE0F;', category: 'paleo', importPath: './machines/paleo_dig_site.js', importName: 'createPaleoDigSite' },
  { id: 'particle_accelerator_detector', name: 'Accelerator Detector', icon: '&#x2699;&#xFE0F;', category: 'particle', importPath: './machines/particle_accelerator_detector.js', importName: 'createParticleAcceleratorDetector' },
  { id: 'pathogen-mutation-sequencer', name: 'Pathogen-Mutation-Sequencer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pathogen-mutation-sequencer.js', importName: 'createPathogenMutationSequencer' },
  { id: 'pcr_thermocycler', name: 'Thermocycler', icon: '&#x2699;&#xFE0F;', category: 'pcr', importPath: './machines/pcr_thermocycler.js', importName: 'createPCRThermocycler' },
  { id: 'pedigree_chart_analysis', name: 'Chart Analysis', icon: '&#x2699;&#xFE0F;', category: 'pedigree', importPath: './machines/pedigree_chart_analysis.js', importName: 'createPedigreeChart' },
  { id: 'periodic_table', name: 'Table', icon: '&#x2699;&#xFE0F;', category: 'periodic', importPath: './machines/periodic_table.js', importName: 'createPeriodicTable' },
  { id: 'pet_ct_scanner', name: 'Ct Scanner', icon: '&#x2699;&#xFE0F;', category: 'pet', importPath: './machines/pet_ct_scanner.js', importName: 'createPETCTScanner' },
  { id: 'pharmacology_drug_metabolism', name: 'Drug Metabolism', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_drug_metabolism.js', importName: 'createDrugMetabolismModel' },
  { id: 'pharmacology_ion_channel', name: 'Ion Channel', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_ion_channel.js', importName: 'createIonChannelModel' },
  { id: 'pharmacology_nanoparticle_delivery', name: 'Nanoparticle Delivery', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_nanoparticle_delivery.js', importName: 'createNanoparticleDeliveryModel' },
  { id: 'pharmacology_receptor_binding', name: 'Receptor Binding', icon: '&#x2699;&#xFE0F;', category: 'pharmacology', importPath: './machines/pharmacology_receptor_binding.js', importName: 'createReceptorBindingModel' },
  { id: 'phononics_crystal_lattice', name: 'Phononics Crystal Lattice', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/phononics_crystal_lattice.js', importName: 'createPhononicCrystalLattice' },
  { id: 'phononics_phonon_waveguide', name: 'Phononics Phonon Waveguide', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/phononics_phonon_waveguide.js', importName: 'createPhononWaveguide' },
  { id: 'phononics_saw_resonator', name: 'Phononics Saw Resonator', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/phononics_saw_resonator.js', importName: 'createSAWResonator' },
  { id: 'phononics_thermal_diode', name: 'Phononics Thermal Diode', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/phononics_thermal_diode.js', importName: 'createThermalDiode' },
  { id: 'phononic_crystal_waveguide', name: 'Phononic Crystal Waveguide', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/phononic_crystal_waveguide.js', importName: 'createPhononicCrystalWaveguide' },
  { id: 'photonics_fiber_optic', name: 'Fiber Optic', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_fiber_optic.js', importName: 'createFiberOptic' },
  { id: 'photonics_interferometer', name: 'Interferometer', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_interferometer.js', importName: 'createInterferometer' },
  { id: 'photonics_laser_cavity', name: 'Photonics Laser Cavity', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/photonics_laser_cavity.js', importName: 'createLaserCavity' },
  { id: 'photonics_optical_tweezer', name: 'Optical Tweezer', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_optical_tweezer.js', importName: 'createOpticalTweezer' },
  { id: 'photonics_prism', name: 'Prism', icon: '&#x2699;&#xFE0F;', category: 'photonics', importPath: './machines/photonics_prism.js', importName: 'createPrismSpectrometer' },
  { id: 'photonic_processor', name: 'Processor', icon: '&#x2699;&#xFE0F;', category: 'photonic', importPath: './machines/photonic_processor.js', importName: 'createPhotonicProcessor' },
  { id: 'photosynthesis_light_reaction', name: 'Light Reaction', icon: '&#x2699;&#xFE0F;', category: 'photosynthesis', importPath: './machines/photosynthesis_light_reaction.js', importName: 'createPhotosynthesis' },
  { id: 'physics_gravitational_wave', name: 'Gravitational Wave', icon: '&#x2699;&#xFE0F;', category: 'physics', importPath: './machines/physics_gravitational_wave.js', importName: 'createGravitationalWaveInterferometer' },
  { id: 'physics_neutrino_detector', name: 'Physics Neutrino Detector', icon: '&#x2699;&#xFE0F;', category: 'neutrino_tech', importPath: './machines/physics_neutrino_detector.js', importName: 'createNeutrinoDetector' },
  { id: 'physics_particle_accelerator', name: 'Particle Accelerator', icon: '&#x2699;&#xFE0F;', category: 'physics', importPath: './machines/physics_particle_accelerator.js', importName: 'createParticleAccelerator' },
  { id: 'physics_quantum_entanglement', name: 'Quantum Entanglement', icon: '&#x2699;&#xFE0F;', category: 'physics', importPath: './machines/physics_quantum_entanglement.js', importName: 'createQuantumEntanglement' },
  { id: 'physics_tokamak', name: 'Tokamak', icon: '&#x2699;&#xFE0F;', category: 'physics', importPath: './machines/physics_tokamak.js', importName: 'createTokamak' },
  { id: 'pitcher_plant_trap', name: 'Plant Trap', icon: '&#x2699;&#xFE0F;', category: 'pitcher', importPath: './machines/pitcher_plant_trap.js', importName: 'createPitcherPlantTrap' },
  { id: 'plasma_hall_effect_thruster', name: 'Plasma Hall Effect Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/plasma_hall_effect_thruster.js', importName: 'createHallEffectThrusterGrid' },
  { id: 'plasma_helicon_double_layer', name: 'Plasma Helicon Double Layer', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/plasma_helicon_double_layer.js', importName: 'createHeliconDoubleLayerThruster' },
  { id: 'plasma_mpd_thruster', name: 'Plasma Mpd Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/plasma_mpd_thruster.js', importName: 'createMPDThruster' },
  { id: 'plasma_physics_hall_thruster', name: 'Physics Hall Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma', importPath: './machines/plasma_physics_hall_thruster.js', importName: 'createHallThruster' },
  { id: 'plasma_physics_icf_chamber', name: 'Physics Icf Chamber', icon: '&#x2699;&#xFE0F;', category: 'plasma', importPath: './machines/plasma_physics_icf_chamber.js', importName: 'createICFChamber' },
  { id: 'plasma_physics_stellarator', name: 'Physics Stellarator', icon: '&#x2699;&#xFE0F;', category: 'plasma', importPath: './machines/plasma_physics_stellarator.js', importName: 'createStellarator' },
  { id: 'plasma_physics_tokamak', name: 'Physics Tokamak', icon: '&#x2699;&#xFE0F;', category: 'plasma', importPath: './machines/plasma_physics_tokamak.js', importName: 'createTokamak' },
  { id: 'plasma_physics_z_pinch', name: 'Physics Z Pinch', icon: '&#x2699;&#xFE0F;', category: 'plasma', importPath: './machines/plasma_physics_z_pinch.js', importName: 'createZPinch' },
  { id: 'plasma_pulsed_inductive_thruster', name: 'Plasma Pulsed Inductive Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/plasma_pulsed_inductive_thruster.js', importName: 'createPulsedInductiveThruster' },
  { id: 'plasma_vasimr', name: 'Plasma Vasimr', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/plasma_vasimr.js', importName: 'createVASIMR' },
  { id: 'plumbing_centrifugal_pump', name: 'Centrifugal Pump', icon: '&#x2699;&#xFE0F;', category: 'plumbing', importPath: './machines/plumbing_centrifugal_pump.js', importName: 'createCentrifugalPump' },
  { id: 'plumbing_double_acting_piston_pump', name: 'Double Acting Piston Pump', icon: '&#x2699;&#xFE0F;', category: 'plumbing', importPath: './machines/plumbing_double_acting_piston_pump.js', importName: 'createDoubleActingPistonPump' },
  { id: 'plumbing_gate_valve', name: 'Gate Valve', icon: '&#x2699;&#xFE0F;', category: 'plumbing', importPath: './machines/plumbing_gate_valve.js', importName: 'createGateValve' },
  { id: 'plumbing_mechanical_water_meter', name: 'Mechanical Water Meter', icon: '&#x2699;&#xFE0F;', category: 'plumbing', importPath: './machines/plumbing_mechanical_water_meter.js', importName: 'createMechanicalWaterMeter' },
  { id: 'plumbing_pressure_relief_valve', name: 'Pressure Relief Valve', icon: '&#x2699;&#xFE0F;', category: 'plumbing', importPath: './machines/plumbing_pressure_relief_valve.js', importName: 'createPressureReliefValve' },
  { id: 'power_generation_coal_plant', name: 'Generation Coal Plant', icon: '&#x2699;&#xFE0F;', category: 'power', importPath: './machines/power_generation_coal_plant.js', importName: 'createCoalPlant' },
  { id: 'power_generation_geothermal_plant', name: 'Power Generation Geothermal Plant', icon: '&#x2699;&#xFE0F;', category: 'geothermal_coring', importPath: './machines/power_generation_geothermal_plant.js', importName: 'createGeothermalPlant' },
  { id: 'power_generation_hydroelectric_dam', name: 'Generation Hydroelectric Dam', icon: '&#x2699;&#xFE0F;', category: 'power', importPath: './machines/power_generation_hydroelectric_dam.js', importName: 'createHydroelectricDam' },
  { id: 'power_generation_nuclear_plant', name: 'Generation Nuclear Plant', icon: '&#x2699;&#xFE0F;', category: 'power', importPath: './machines/power_generation_nuclear_plant.js', importName: 'createNuclearPlant' },
  { id: 'power_generation_wind_turbine', name: 'Generation Wind Turbine', icon: '&#x2699;&#xFE0F;', category: 'power', importPath: './machines/power_generation_wind_turbine.js', importName: 'createWindTurbine' },
  { id: 'printing_braille_embosser', name: 'Braille Embosser', icon: '&#x2699;&#xFE0F;', category: 'printing', importPath: './machines/printing_braille_embosser.js', importName: 'createBrailleEmbosser' },
  { id: 'printing_fdm_3d_printer', name: 'Fdm 3D Printer', icon: '&#x2699;&#xFE0F;', category: 'printing', importPath: './machines/printing_fdm_3d_printer.js', importName: 'createFDM3DPrinter' },
  { id: 'printing_laser_printer', name: 'Printing Laser Printer', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/printing_laser_printer.js', importName: 'createLaserPrinter' },
  { id: 'printing_offset_press', name: 'Offset Press', icon: '&#x2699;&#xFE0F;', category: 'printing', importPath: './machines/printing_offset_press.js', importName: 'createOffsetPress' },
  { id: 'printing_vintage_typewriter', name: 'Vintage Typewriter', icon: '&#x2699;&#xFE0F;', category: 'printing', importPath: './machines/printing_vintage_typewriter.js', importName: 'createVintageTypewriter' },
  { id: 'process_scheduler', name: 'Scheduler', icon: '&#x2699;&#xFE0F;', category: 'process', importPath: './machines/process_scheduler.js', importName: 'createProcessScheduler' },
  { id: 'propulsion_ion_thruster', name: 'Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_ion_thruster.js', importName: 'createIonThruster' },
  { id: 'propulsion_liquid_rocket', name: 'Liquid Rocket', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_liquid_rocket.js', importName: 'createLiquidRocket' },
  { id: 'propulsion_pulsejet', name: 'Pulsejet', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_pulsejet.js', importName: 'createPulsejet' },
  { id: 'propulsion_scramjet', name: 'Scramjet', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_scramjet.js', importName: 'createScramjet' },
  { id: 'propulsion_systems_hall_effect', name: 'Propulsion Systems Hall Effect', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/propulsion_systems_hall_effect.js', importName: 'createHallEffectThruster' },
  { id: 'propulsion_systems_nuclear_thermal', name: 'Systems Nuclear Thermal', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_systems_nuclear_thermal.js', importName: 'createNuclearThermal' },
  { id: 'propulsion_systems_scramjet', name: 'Systems Scramjet', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_systems_scramjet.js', importName: 'createScramjet' },
  { id: 'propulsion_systems_solid_rocket', name: 'Systems Solid Rocket', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_systems_solid_rocket.js', importName: 'createSolidRocket' },
  { id: 'propulsion_turbojet', name: 'Turbojet', icon: '&#x2699;&#xFE0F;', category: 'propulsion', importPath: './machines/propulsion_turbojet.js', importName: 'createTurbojet' },
  { id: 'prosthetics_bionic_arm', name: 'Bionic Arm', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_bionic_arm.js', importName: 'createBionicArm' },
  { id: 'prosthetics_cochlear_implant', name: 'Cochlear Implant', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_cochlear_implant.js', importName: 'createCochlearImplant' },
  { id: 'prosthetics_exoskeleton_leg', name: 'Exoskeleton Leg', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_exoskeleton_leg.js', importName: 'createExoskeletonLeg' },
  { id: 'prosthetics_neural_bypass_spine', name: 'Neural Bypass Spine', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_neural_bypass_spine.js', importName: 'createNeuralBypassSpine' },
  { id: 'prosthetics_retinal_implant', name: 'Retinal Implant', icon: '&#x2699;&#xFE0F;', category: 'prosthetics', importPath: './machines/prosthetics_retinal_implant.js', importName: 'createRetinalImplant' },
  { id: 'protein_folding_structures', name: 'Folding Structures', icon: '&#x2699;&#xFE0F;', category: 'protein', importPath: './machines/protein_folding_structures.js', importName: 'createProteinFolding' },
  { id: 'proton_therapy_cyclotron', name: 'Therapy Cyclotron', icon: '&#x2699;&#xFE0F;', category: 'proton', importPath: './machines/proton_therapy_cyclotron.js', importName: 'createProtonTherapyCyclotron' },
  { id: 'punnett_square_inheritance', name: 'Square Inheritance', icon: '&#x2699;&#xFE0F;', category: 'punnett', importPath: './machines/punnett_square_inheritance.js', importName: 'createPunnettSquare' },
  { id: 'quantum_chromodynamics_asymptotic_freedom', name: 'Chromodynamics Asymptotic Freedom', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_chromodynamics_asymptotic_freedom.js', importName: 'createAsymptoticFreedom' },
  { id: 'quantum_chromodynamics_flux_tube', name: 'Chromodynamics Flux Tube', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_chromodynamics_flux_tube.js', importName: 'createFluxTube' },
  { id: 'quantum_chromodynamics_gluon_vertex', name: 'Chromodynamics Gluon Vertex', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_chromodynamics_gluon_vertex.js', importName: 'createGluonVertex' },
  { id: 'quantum_chromodynamics_proton_structure', name: 'Chromodynamics Proton Structure', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_chromodynamics_proton_structure.js', importName: 'createProtonStructure' },
  { id: 'quantum_chromodynamics_qgp_expansion', name: 'Chromodynamics Qgp Expansion', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_chromodynamics_qgp_expansion.js', importName: 'createQGPExpansion' },
  { id: 'quantum_computer_dilution_refrigerator', name: 'Computer Dilution Refrigerator', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_computer_dilution_refrigerator.js', importName: 'createQuantumComputer' },
  { id: 'quantum_dilution_fridge', name: 'Dilution Fridge', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_dilution_fridge.js', importName: 'createDilutionFridge' },
  { id: 'quantum_ion_trap', name: 'Ion Trap', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_ion_trap.js', importName: 'createIonTrap' },
  { id: 'quantum_josephson_junction', name: 'Quantum Josephson Junction', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/quantum_josephson_junction.js', importName: 'createJosephsonJunction' },
  { id: 'quantum_key_distribution', name: 'Key Distribution', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_key_distribution.js', importName: 'createQuantumKeyDistribution' },
  { id: 'quantum_logic_gate', name: 'Logic Gate', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_logic_gate.js', importName: 'createQuantumLogicGate' },
  { id: 'quantum_microwave_cables', name: 'Quantum Microwave Cables', icon: '&#x2699;&#xFE0F;', category: 'directed_energy', importPath: './machines/quantum_microwave_cables.js', importName: 'createMicrowaveCables' },
  { id: 'quantum_parametric_amplifier', name: 'Parametric Amplifier', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_parametric_amplifier.js', importName: 'createParametricAmplifier' },
  { id: 'quantum_qubit_chip', name: 'Qubit Chip', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_qubit_chip.js', importName: 'createQubitChip' },
  { id: 'radar_altimeter', name: 'Altimeter', icon: '&#x2699;&#xFE0F;', category: 'radar', importPath: './machines/radar_altimeter.js', importName: 'createRadarAltimeter' },
  { id: 'radiochemistry_centrifuge', name: 'Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_centrifuge.js', importName: 'createCentrifuge' },
  { id: 'radiochemistry_geiger_counter', name: 'Geiger Counter', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_geiger_counter.js', importName: 'createGeigerCounter' },
  { id: 'radiochemistry_glovebox', name: 'Glovebox', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_glovebox.js', importName: 'createGlovebox' },
  { id: 'radiochemistry_hot_cell', name: 'Hot Cell', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_hot_cell.js', importName: 'createHotCell' },
  { id: 'radiochemistry_scintillation_vial', name: 'Scintillation Vial', icon: '&#x2699;&#xFE0F;', category: 'radiochemistry', importPath: './machines/radiochemistry_scintillation_vial.js', importName: 'createScintillationVial' },
  { id: 'radiometric_dating_spectrometer', name: 'Dating Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'radiometric', importPath: './machines/radiometric_dating_spectrometer.js', importName: 'createRadiometricDatingSpectrometer' },
  { id: 'red_blood_cell', name: 'Blood Cell', icon: '&#x2699;&#xFE0F;', category: 'red', importPath: './machines/red_blood_cell.js', importName: 'create' },
  { id: 'reflex_arc_spinal_cord', name: 'Arc Spinal Cord', icon: '&#x2699;&#xFE0F;', category: 'reflex', importPath: './machines/reflex_arc_spinal_cord.js', importName: 'createReflexArc' },
  { id: 'reinforcement_learning', name: 'Learning', icon: '&#x2699;&#xFE0F;', category: 'reinforcement', importPath: './machines/reinforcement_learning.js', importName: 'createReinforcementLearningLoop' },
  { id: 'respiratory_system_lungs', name: 'System Lungs', icon: '&#x2699;&#xFE0F;', category: 'respiratory', importPath: './machines/respiratory_system_lungs.js', importName: 'createRespiratorySystem' },
  { id: 'rheology_capillary_rheometer', name: 'Capillary Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_capillary_rheometer.js', importName: 'createCapillaryRheometer' },
  { id: 'rheology_extensional_rheometer', name: 'Extensional Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_extensional_rheometer.js', importName: 'createExtensionalRheometer' },
  { id: 'rheology_falling_ball_viscometer', name: 'Falling Ball Viscometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_falling_ball_viscometer.js', importName: 'createFallingBallViscometer' },
  { id: 'rheology_oscillatory_rheometer', name: 'Oscillatory Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_oscillatory_rheometer.js', importName: 'createOscillatoryRheometer' },
  { id: 'rheology_rotational_rheometer', name: 'Rotational Rheometer', icon: '&#x2699;&#xFE0F;', category: 'rheology', importPath: './machines/rheology_rotational_rheometer.js', importName: 'createRotationalRheometer' },
  { id: 'ribosome', name: 'Ribosome', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ribosome.js', importName: 'createRibosome' },
  { id: 'robotics_animatronic_facial_rig', name: 'Animatronic Facial Rig', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_animatronic_facial_rig.js', importName: 'createAnimatronicFacialRig' },
  { id: 'robotics_bipedal_mechanism', name: 'Bipedal Mechanism', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_bipedal_mechanism.js', importName: 'createBipedalMechanism' },
  { id: 'robotics_industrial_welding_arm', name: 'Industrial Welding Arm', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_industrial_welding_arm.js', importName: 'createIndustrialWeldingArm' },
  { id: 'robotics_omni_directional_wheel_drive', name: 'Omni Directional Wheel Drive', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_omni_directional_wheel_drive.js', importName: 'createOmniDirectionalWheelDrive' },
  { id: 'robotics_quadruped_robot_leg', name: 'Quadruped Robot Leg', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_quadruped_robot_leg.js', importName: 'createQuadrupedRobotLeg' },
  { id: 'robot_arm', name: 'Arm', icon: '&#x2699;&#xFE0F;', category: 'robot', importPath: './machines/robot_arm.js', importName: 'createRobotArm' },
  { id: 'rsa_encryption', name: 'Encryption', icon: '&#x2699;&#xFE0F;', category: 'rsa', importPath: './machines/rsa_encryption.js', importName: 'createRSAEncryption' },
  { id: 'schrodinger_cat_box_conceptual', name: 'Cat Box Conceptual', icon: '&#x2699;&#xFE0F;', category: 'schrodinger', importPath: './machines/schrodinger_cat_box_conceptual.js', importName: 'createSchrodingerCat' },
  { id: 'scramjet_engine', name: 'Engine', icon: '&#x2699;&#xFE0F;', category: 'scramjet', importPath: './machines/scramjet_engine.js', importName: 'createScramjetEngine' },
  { id: 'seafloor_seismometer', name: 'Seismometer', icon: '&#x2699;&#xFE0F;', category: 'seafloor', importPath: './machines/seafloor_seismometer.js', importName: 'createSeafloorSeismometer' },
  { id: 'seed_germination_process', name: 'Germination Process', icon: '&#x2699;&#xFE0F;', category: 'seed', importPath: './machines/seed_germination_process.js', importName: 'createSeedGerminationProcess' },
  { id: 'seismology_earthquake_epicenter', name: 'Earthquake Epicenter', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismology_earthquake_epicenter.js', importName: 'createEarthquakeEpicenter' },
  { id: 'seismology_fault_line', name: 'Fault Line', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismology_fault_line.js', importName: 'createFaultLine' },
  { id: 'seismology_tectonic_plates', name: 'Tectonic Plates', icon: '&#x2699;&#xFE0F;', category: 'seismology', importPath: './machines/seismology_tectonic_plates.js', importName: 'createTectonicPlates' },
  { id: 'shake_table_simulator', name: 'Table Simulator', icon: '&#x2699;&#xFE0F;', category: 'shake', importPath: './machines/shake_table_simulator.js', importName: 'createShakeTableSimulator' },
  { id: 'siege_battering_ram', name: 'Battering Ram', icon: '&#x2699;&#xFE0F;', category: 'siege', importPath: './machines/siege_battering_ram.js', importName: 'createBatteringRam' },
  { id: 'siege_greek_fire', name: 'Greek Fire', icon: '&#x2699;&#xFE0F;', category: 'siege', importPath: './machines/siege_greek_fire.js', importName: 'createGreekFireSiphon' },
  { id: 'siege_trebuchet', name: 'Trebuchet', icon: '&#x2699;&#xFE0F;', category: 'siege', importPath: './machines/siege_trebuchet.js', importName: 'createTrebuchet' },
  { id: 'single_photon_detector', name: 'Photon Detector', icon: '&#x2699;&#xFE0F;', category: 'single', importPath: './machines/single_photon_detector.js', importName: 'createPhotonDetector' },
  { id: 'skeletal_muscle_contraction', name: 'Muscle Contraction', icon: '&#x2699;&#xFE0F;', category: 'skeletal', importPath: './machines/skeletal_muscle_contraction.js', importName: 'createSkeletalMuscle' },
  { id: 'solar_system', name: 'System', icon: '&#x2699;&#xFE0F;', category: 'solar', importPath: './machines/solar_system.js', importName: 'createSolarSystem' },
  { id: 'sonar_phased_array', name: 'Sonar Phased Array', icon: '&#x2699;&#xFE0F;', category: 'acoustic_metamaterials', importPath: './machines/sonar_phased_array.js', importName: 'createSonarPhasedArray' },
  { id: 'sonochemistry_cavitation_bubble', name: 'Cavitation Bubble', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_cavitation_bubble.js', importName: 'createCavitationBubble' },
  { id: 'sonochemistry_probe_sonicator', name: 'Probe Sonicator', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_probe_sonicator.js', importName: 'createProbeSonicator' },
  { id: 'sonochemistry_reactor', name: 'Reactor', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_reactor.js', importName: 'createSonochemicalReactor' },
  { id: 'sonochemistry_ultrasonic_bath', name: 'Ultrasonic Bath', icon: '&#x2699;&#xFE0F;', category: 'sonochemistry', importPath: './machines/sonochemistry_ultrasonic_bath.js', importName: 'createUltrasonicBath' },
  { id: 'spacecraft_engineering_cmg', name: 'Engineering Cmg', icon: '&#x2699;&#xFE0F;', category: 'spacecraft', importPath: './machines/spacecraft_engineering_cmg.js', importName: 'createControlMomentGyroscope' },
  { id: 'spacecraft_engineering_ion_thruster', name: 'Engineering Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'spacecraft', importPath: './machines/spacecraft_engineering_ion_thruster.js', importName: 'createIonThruster' },
  { id: 'spacecraft_engineering_reaction_wheel', name: 'Engineering Reaction Wheel', icon: '&#x2699;&#xFE0F;', category: 'spacecraft', importPath: './machines/spacecraft_engineering_reaction_wheel.js', importName: 'createReactionWheel' },
  { id: 'spacecraft_engineering_solar_array', name: 'Engineering Solar Array', icon: '&#x2699;&#xFE0F;', category: 'spacecraft', importPath: './machines/spacecraft_engineering_solar_array.js', importName: 'createSolarArray' },
  { id: 'spacecraft_engineering_star_tracker', name: 'Engineering Star Tracker', icon: '&#x2699;&#xFE0F;', category: 'spacecraft', importPath: './machines/spacecraft_engineering_star_tracker.js', importName: 'createStarTracker' },
  { id: 'space_station_airlock', name: 'Station Airlock', icon: '&#x2699;&#xFE0F;', category: 'space', importPath: './machines/space_station_airlock.js', importName: 'createAirlockChamber' },
  { id: 'space_station_centrifuge', name: 'Station Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'space', importPath: './machines/space_station_centrifuge.js', importName: 'createCentrifugeHabitat' },
  { id: 'space_station_cupola', name: 'Station Cupola', icon: '&#x2699;&#xFE0F;', category: 'space', importPath: './machines/space_station_cupola.js', importName: 'createCupolaModule' },
  { id: 'space_station_docking_port', name: 'Station Docking Port', icon: '&#x2699;&#xFE0F;', category: 'space', importPath: './machines/space_station_docking_port.js', importName: 'createDockingPortAdapter' },
  { id: 'space_station_solar_array', name: 'Station Solar Array', icon: '&#x2699;&#xFE0F;', category: 'space', importPath: './machines/space_station_solar_array.js', importName: 'createSolarArrayTruss' },
  { id: 'spatiotemporal_chronosphere', name: 'Chronosphere', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_chronosphere.js', importName: 'createChronosphere' },
  { id: 'spatiotemporal_gravitational_wave', name: 'Gravitational Wave', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_gravitational_wave.js', importName: 'createGravitationalWave' },
  { id: 'spatiotemporal_lightcone', name: 'Lightcone', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_lightcone.js', importName: 'createLightCone' },
  { id: 'spatiotemporal_tesseract', name: 'Tesseract', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_tesseract.js', importName: 'createTesseract' },
  { id: 'spatiotemporal_wormhole', name: 'Wormhole', icon: '&#x2699;&#xFE0F;', category: 'spatiotemporal', importPath: './machines/spatiotemporal_wormhole.js', importName: 'createWormhole' },
  { id: 'spider_web_spinneret', name: 'Web Spinneret', icon: '&#x2699;&#xFE0F;', category: 'spider', importPath: './machines/spider_web_spinneret.js', importName: 'createSpiderSpinneret' },
  { id: 'spintronics_datta_das_transistor', name: 'Datta Das Transistor', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_datta_das_transistor.js', importName: 'createDattaDasTransistor' },
  { id: 'spintronics_magnetic_tunnel_junction', name: 'Magnetic Tunnel Junction', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_magnetic_tunnel_junction.js', importName: 'createMagneticTunnelJunction' },
  { id: 'spintronics_racetrack_memory', name: 'Racetrack Memory', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_racetrack_memory.js', importName: 'createRacetrackMemory' },
  { id: 'spintronics_spin_torque_oscillator', name: 'Spin Torque Oscillator', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_spin_torque_oscillator.js', importName: 'createSpinTorqueOscillator' },
  { id: 'spintronics_spin_valve', name: 'Spin Valve', icon: '&#x2699;&#xFE0F;', category: 'spintronics', importPath: './machines/spintronics_spin_valve.js', importName: 'createSpinValve' },
  { id: 'squid_sensor', name: 'Sensor', icon: '&#x2699;&#xFE0F;', category: 'squid', importPath: './machines/squid_sensor.js', importName: 'createSQUID' },
  { id: 'statistics_central_limit_theorem', name: 'Central Limit Theorem', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_central_limit_theorem.js', importName: 'createCentralLimitTheorem' },
  { id: 'statistics_galton_board', name: 'Galton Board', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_galton_board.js', importName: 'createGaltonBoard' },
  { id: 'statistics_markov_chain', name: 'Markov Chain', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_markov_chain.js', importName: 'createMarkovChain' },
  { id: 'statistics_normal_distribution', name: 'Normal Distribution', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_normal_distribution.js', importName: 'createNormalDistribution' },
  { id: 'statistics_scatter_plot_regression', name: 'Scatter Plot Regression', icon: '&#x2699;&#xFE0F;', category: 'statistics', importPath: './machines/statistics_scatter_plot_regression.js', importName: 'createScatterPlotRegression' },
  { id: 'steadicam_gimbal', name: 'Gimbal', icon: '&#x2699;&#xFE0F;', category: 'steadicam', importPath: './machines/steadicam_gimbal.js', importName: 'createSteadicamGimbal' },
  { id: 'stellar_kinematics_accretion_disk', name: 'Kinematics Accretion Disk', icon: '&#x2699;&#xFE0F;', category: 'stellar', importPath: './machines/stellar_kinematics_accretion_disk.js', importName: 'createAccretionDisk' },
  { id: 'stellar_kinematics_binary_system', name: 'Kinematics Binary System', icon: '&#x2699;&#xFE0F;', category: 'stellar', importPath: './machines/stellar_kinematics_binary_system.js', importName: 'createBinaryStarSystem' },
  { id: 'stellar_kinematics_galactic_rotation', name: 'Kinematics Galactic Rotation', icon: '&#x2699;&#xFE0F;', category: 'stellar', importPath: './machines/stellar_kinematics_galactic_rotation.js', importName: 'createGalacticRotation' },
  { id: 'stellar_kinematics_keplerian_orbit', name: 'Kinematics Keplerian Orbit', icon: '&#x2699;&#xFE0F;', category: 'stellar', importPath: './machines/stellar_kinematics_keplerian_orbit.js', importName: 'createKeplerianOrbit' },
  { id: 'stellar_kinematics_orbital_precession', name: 'Kinematics Orbital Precession', icon: '&#x2699;&#xFE0F;', category: 'stellar', importPath: './machines/stellar_kinematics_orbital_precession.js', importName: 'createOrbitalPrecession' },
  { id: 'stern_gerlach_experiment', name: 'Gerlach Experiment', icon: '&#x2699;&#xFE0F;', category: 'stern', importPath: './machines/stern_gerlach_experiment.js', importName: 'createSternGerlachExperiment' },
  { id: 'subatomic_electron_orbital', name: 'Electron Orbital', icon: '&#x2699;&#xFE0F;', category: 'subatomic', importPath: './machines/subatomic_electron_orbital.js', importName: 'createElectronOrbital' },
  { id: 'subatomic_gluon_field', name: 'Gluon Field', icon: '&#x2699;&#xFE0F;', category: 'subatomic', importPath: './machines/subatomic_gluon_field.js', importName: 'createGluonField' },
  { id: 'subatomic_higgs_boson', name: 'Higgs Boson', icon: '&#x2699;&#xFE0F;', category: 'subatomic', importPath: './machines/subatomic_higgs_boson.js', importName: 'createHiggsBosonInteraction' },
  { id: 'subatomic_quark_triplet', name: 'Subatomic Quark Triplet', icon: '&#x2699;&#xFE0F;', category: 'exotic_matter', importPath: './machines/subatomic_quark_triplet.js', importName: 'createQuarkTriplet' },
  { id: 'subglacial_buoyancy_control_bladder', name: 'Subglacial Buoyancy Control Bladder', icon: '&#x2699;&#xFE0F;', category: 'subglacial_exploration', importPath: './machines/subglacial_buoyancy_control_bladder.js', importName: 'createBuoyancyControlBladder' },
  { id: 'subglacial_ice_penetrating_radar_antenna', name: 'Subglacial Ice Penetrating Radar Antenna', icon: '&#x2699;&#xFE0F;', category: 'subglacial_exploration', importPath: './machines/subglacial_ice_penetrating_radar_antenna.js', importName: 'createIcePenetratingRadarAntenna' },
  { id: 'subglacial_nuclear_cryobot_melt_probe', name: 'Subglacial Nuclear Cryobot Melt Probe', icon: '&#x2699;&#xFE0F;', category: 'cryogenic_supercomputing', importPath: './machines/subglacial_nuclear_cryobot_melt_probe.js', importName: 'createNuclearCryobotMeltProbe' },
  { id: 'subglacial_subglacial_geyser_sampler', name: 'Subglacial Subglacial Geyser Sampler', icon: '&#x2699;&#xFE0F;', category: 'subglacial_exploration', importPath: './machines/subglacial_subglacial_geyser_sampler.js', importName: 'createSubglacialGeyserSampler' },
  { id: 'subglacial_sub_ice_auv_hydrobot', name: 'Subglacial Sub Ice Auv Hydrobot', icon: '&#x2699;&#xFE0F;', category: 'subglacial_exploration', importPath: './machines/subglacial_sub_ice_auv_hydrobot.js', importName: 'createSubIceAUVHydrobot' },
  { id: 'submarine', name: 'Submarine', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/submarine.js', importName: 'createSubmarine' },
  { id: 'supersonic_nozzle', name: 'Nozzle', icon: '&#x2699;&#xFE0F;', category: 'supersonic', importPath: './machines/supersonic_nozzle.js', importName: 'createSupersonicNozzle' },
  { id: 'synapse_action_potential', name: 'Action Potential', icon: '&#x2699;&#xFE0F;', category: 'synapse', importPath: './machines/synapse_action_potential.js', importName: 'createSynapseActionPotential' },
  { id: 'synthetic_biology_crispr_cas9', name: 'Biology Crispr Cas9', icon: '&#x2699;&#xFE0F;', category: 'synthetic', importPath: './machines/synthetic_biology_crispr_cas9.js', importName: 'createCrisprCas9' },
  { id: 'synthetic_biology_dna_origami', name: 'Biology Dna Origami', icon: '&#x2699;&#xFE0F;', category: 'synthetic', importPath: './machines/synthetic_biology_dna_origami.js', importName: 'createDnaOrigami' },
  { id: 'synthetic_biology_ribosome_translator', name: 'Biology Ribosome Translator', icon: '&#x2699;&#xFE0F;', category: 'synthetic', importPath: './machines/synthetic_biology_ribosome_translator.js', importName: 'createRibosomeTranslator' },
  { id: 'synthetic_biology_synthetic_cell', name: 'Biology Cell', icon: '&#x2699;&#xFE0F;', category: 'synthetic', importPath: './machines/synthetic_biology_synthetic_cell.js', importName: 'createSyntheticCell' },
  { id: 'synthetic_biology_viral_vector', name: 'Biology Viral Vector', icon: '&#x2699;&#xFE0F;', category: 'synthetic', importPath: './machines/synthetic_biology_viral_vector.js', importName: 'createViralVector' },
  { id: 'tectonic_plate_boundary', name: 'Plate Boundary', icon: '&#x2699;&#xFE0F;', category: 'tectonic', importPath: './machines/tectonic_plate_boundary.js', importName: 'createTectonicPlateBoundary' },
  { id: 'tectonophysics_continental_collision', name: 'Continental Collision', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_continental_collision.js', importName: 'createContinentalCollision' },
  { id: 'tectonophysics_mantle_convection', name: 'Mantle Convection', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_mantle_convection.js', importName: 'createMantleConvection' },
  { id: 'tectonophysics_seafloor_spreading', name: 'Seafloor Spreading', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_seafloor_spreading.js', importName: 'createSeafloorSpreading' },
  { id: 'tectonophysics_subduction_zone', name: 'Subduction Zone', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_subduction_zone.js', importName: 'createSubductionZone' },
  { id: 'tectonophysics_transform_fault', name: 'Transform Fault', icon: '&#x2699;&#xFE0F;', category: 'tectonophysics', importPath: './machines/tectonophysics_transform_fault.js', importName: 'createTransformFault' },
  { id: 'telescope_arecibo', name: 'Arecibo', icon: '&#x2699;&#xFE0F;', category: 'telescope', importPath: './machines/telescope_arecibo.js', importName: 'createArecibo' },
  { id: 'telescope_chandra', name: 'Chandra', icon: '&#x2699;&#xFE0F;', category: 'telescope', importPath: './machines/telescope_chandra.js', importName: 'createChandra' },
  { id: 'telescope_elt', name: 'Elt', icon: '&#x2699;&#xFE0F;', category: 'telescope', importPath: './machines/telescope_elt.js', importName: 'createELT' },
  { id: 'telescope_hubble', name: 'Hubble', icon: '&#x2699;&#xFE0F;', category: 'telescope', importPath: './machines/telescope_hubble.js', importName: 'createHubble' },
  { id: 'telescope_jwst', name: 'Jwst', icon: '&#x2699;&#xFE0F;', category: 'telescope', importPath: './machines/telescope_jwst.js', importName: 'createJWST' },
  { id: 'terraform_atmosphere_processor', name: 'Terraform Atmosphere Processor', icon: '&#x2699;&#xFE0F;', category: 'terraforming_systems', importPath: './machines/terraform_atmosphere_processor.js', importName: 'createAtmosphereProcessor' },
  { id: 'terraform_comet_tug', name: 'Terraform Comet Tug', icon: '&#x2699;&#xFE0F;', category: 'terraforming_systems', importPath: './machines/terraform_comet_tug.js', importName: 'createCometTug' },
  { id: 'terraform_cyanobacteria_rover', name: 'Terraform Cyanobacteria Rover', icon: '&#x2699;&#xFE0F;', category: 'terraforming_systems', importPath: './machines/terraform_cyanobacteria_rover.js', importName: 'createCyanobacteriaRover' },
  { id: 'terraform_magnetic_shield_generator', name: 'Terraform Magnetic Shield Generator', icon: '&#x2699;&#xFE0F;', category: 'terraforming_systems', importPath: './machines/terraform_magnetic_shield_generator.js', importName: 'createMagneticShieldGenerator' },
  { id: 'terraform_orbital_sunshade', name: 'Terraform Orbital Sunshade', icon: '&#x2699;&#xFE0F;', category: 'terraforming_systems', importPath: './machines/terraform_orbital_sunshade.js', importName: 'createOrbitalSunshade' },
  { id: 'textile_cotton_gin', name: 'Cotton Gin', icon: '&#x2699;&#xFE0F;', category: 'textile', importPath: './machines/textile_cotton_gin.js', importName: 'createCottonGin' },
  { id: 'textile_knitting_machine', name: 'Knitting Machine', icon: '&#x2699;&#xFE0F;', category: 'textile', importPath: './machines/textile_knitting_machine.js', importName: 'createKnittingMachine' },
  { id: 'textile_power_loom', name: 'Power Loom', icon: '&#x2699;&#xFE0F;', category: 'textile', importPath: './machines/textile_power_loom.js', importName: 'createPowerLoom' },
  { id: 'textile_sewing_machine', name: 'Sewing Machine', icon: '&#x2699;&#xFE0F;', category: 'textile', importPath: './machines/textile_sewing_machine.js', importName: 'createSewingMachine' },
  { id: 'textile_spinning_wheel', name: 'Spinning Wheel', icon: '&#x2699;&#xFE0F;', category: 'textile', importPath: './machines/textile_spinning_wheel.js', importName: 'createSpinningWheel' },
  { id: 'theme_park_bumper_car', name: 'Park Bumper Car', icon: '&#x2699;&#xFE0F;', category: 'theme', importPath: './machines/theme_park_bumper_car.js', importName: 'createBumperCar' },
  { id: 'theme_park_drop_tower', name: 'Park Drop Tower', icon: '&#x2699;&#xFE0F;', category: 'theme', importPath: './machines/theme_park_drop_tower.js', importName: 'createDropTower' },
  { id: 'theme_park_giant_pendulum', name: 'Park Giant Pendulum', icon: '&#x2699;&#xFE0F;', category: 'theme', importPath: './machines/theme_park_giant_pendulum.js', importName: 'createGiantPendulumRide' },
  { id: 'theme_park_scrambler', name: 'Park Scrambler', icon: '&#x2699;&#xFE0F;', category: 'theme', importPath: './machines/theme_park_scrambler.js', importName: 'createScramblerRide' },
  { id: 'theme_park_top_spin', name: 'Park Top Spin', icon: '&#x2699;&#xFE0F;', category: 'theme', importPath: './machines/theme_park_top_spin.js', importName: 'createTopSpinRide' },
  { id: 'thermoelectrics_peltier_cooler', name: 'Peltier Cooler', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_peltier_cooler.js', importName: 'createPeltierCooler' },
  { id: 'thermoelectrics_pn_junction_couple', name: 'Pn Junction Couple', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_pn_junction_couple.js', importName: 'createPNJunctionCouple' },
  { id: 'thermoelectrics_rtg', name: 'Rtg', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_rtg.js', importName: 'createRTG' },
  { id: 'thermoelectrics_seebeck_generator', name: 'Seebeck Generator', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_seebeck_generator.js', importName: 'createSeebeckGenerator' },
  { id: 'thermoelectrics_thomson_effect_demo', name: 'Thomson Effect Demo', icon: '&#x2699;&#xFE0F;', category: 'thermoelectrics', importPath: './machines/thermoelectrics_thomson_effect_demo.js', importName: 'createThomsonEffectDemo' },
  { id: 'tidal_energy_turbine', name: 'Energy Turbine', icon: '&#x2699;&#xFE0F;', category: 'tidal', importPath: './machines/tidal_energy_turbine.js', importName: 'createTidalEnergyTurbine' },
  { id: 'timekeeping_astrolabe', name: 'Astrolabe', icon: '&#x2699;&#xFE0F;', category: 'timekeeping', importPath: './machines/timekeeping_astrolabe.js', importName: 'createAstrolabe' },
  { id: 'timekeeping_incense_clock', name: 'Incense Clock', icon: '&#x2699;&#xFE0F;', category: 'timekeeping', importPath: './machines/timekeeping_incense_clock.js', importName: 'createIncenseClock' },
  { id: 'timekeeping_marine_chronometer', name: 'Marine Chronometer', icon: '&#x2699;&#xFE0F;', category: 'timekeeping', importPath: './machines/timekeeping_marine_chronometer.js', importName: 'createMarineChronometer' },
  { id: 'timekeeping_pendulum_escapement', name: 'Pendulum Escapement', icon: '&#x2699;&#xFE0F;', category: 'timekeeping', importPath: './machines/timekeeping_pendulum_escapement.js', importName: 'createPendulumEscapement' },
  { id: 'timekeeping_water_clock', name: 'Water Clock', icon: '&#x2699;&#xFE0F;', category: 'timekeeping', importPath: './machines/timekeeping_water_clock.js', importName: 'createWaterClock' },
  { id: 'tokamak_fusion_reactor', name: 'Fusion Reactor', icon: '&#x2699;&#xFE0F;', category: 'tokamak', importPath: './machines/tokamak_fusion_reactor.js', importName: 'createTokamakFusionReactor' },
  { id: 'topology_hopf_fibration', name: 'Hopf Fibration', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_hopf_fibration.js', importName: 'createHopfFibration' },
  { id: 'topology_klein_bottle', name: 'Klein Bottle', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_klein_bottle.js', importName: 'createKleinBottle' },
  { id: 'topology_mobius_strip', name: 'Mobius Strip', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_mobius_strip.js', importName: 'createMobiusStrip' },
  { id: 'topology_seifert_surface', name: 'Seifert Surface', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_seifert_surface.js', importName: 'createSeifertSurface' },
  { id: 'topology_torus_knot', name: 'Torus Knot', icon: '&#x2699;&#xFE0F;', category: 'topology', importPath: './machines/topology_torus_knot.js', importName: 'createTorusKnot' },
  { id: 'tower_crane', name: 'Crane', icon: '&#x2699;&#xFE0F;', category: 'tower', importPath: './machines/tower_crane.js', importName: 'createTowerCrane' },
  { id: 'transcription_mrna_synthesis', name: 'Mrna Synthesis', icon: '&#x2699;&#xFE0F;', category: 'transcription', importPath: './machines/transcription_mrna_synthesis.js', importName: 'createTranscription' },
  { id: 'transformer_model', name: 'Model', icon: '&#x2699;&#xFE0F;', category: 'transformer', importPath: './machines/transformer_model.js', importName: 'createTransformerArchitecture' },
  { id: 'translation_ribosome_protein', name: 'Ribosome Protein', icon: '&#x2699;&#xFE0F;', category: 'translation', importPath: './machines/translation_ribosome_protein.js', importName: 'createTranslation' },
  { id: 'tree_xylem_phloem', name: 'Xylem Phloem', icon: '&#x2699;&#xFE0F;', category: 'tree', importPath: './machines/tree_xylem_phloem.js', importName: 'createTreeXylemPhloem' },
  { id: 'triboelectricity_electrophorus', name: 'Electrophorus', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_electrophorus.js', importName: 'createElectrophorus' },
  { id: 'triboelectricity_faraday_ice_pail', name: 'Faraday Ice Pail', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_faraday_ice_pail.js', importName: 'createFaradayIcePail' },
  { id: 'triboelectricity_kelvin_water_dropper', name: 'Kelvin Water Dropper', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_kelvin_water_dropper.js', importName: 'createKelvinWaterDropper' },
  { id: 'triboelectricity_vandegraaff_generator', name: 'Vandegraaff Generator', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_vandegraaff_generator.js', importName: 'createVanDeGraaffGenerator' },
  { id: 'triboelectricity_wimshurst_machine', name: 'Wimshurst Machine', icon: '&#x2699;&#xFE0F;', category: 'triboelectricity', importPath: './machines/triboelectricity_wimshurst_machine.js', importName: 'createWimshurstMachine' },
  { id: 'tribology_ball_on_disk', name: 'Ball On Disk', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_ball_on_disk.js', importName: 'createBallOnDisk' },
  { id: 'tribology_four_ball_tester', name: 'Four Ball Tester', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_four_ball_tester.js', importName: 'createFourBallTester' },
  { id: 'tribology_journal_bearing', name: 'Journal Bearing', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_journal_bearing.js', importName: 'createJournalBearing' },
  { id: 'tribology_stribeck_apparatus', name: 'Stribeck Apparatus', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_stribeck_apparatus.js', importName: 'createStribeckApparatus' },
  { id: 'tribology_surface_asperities', name: 'Surface Asperities', icon: '&#x2699;&#xFE0F;', category: 'tribology', importPath: './machines/tribology_surface_asperities.js', importName: 'createSurfaceAsperities' },
  { id: 'tsunami_buoy_detector', name: 'Buoy Detector', icon: '&#x2699;&#xFE0F;', category: 'tsunami', importPath: './machines/tsunami_buoy_detector.js', importName: 'createTsunamiBuoyDetector' },
  { id: 'tuned_mass_damper', name: 'Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'tuned', importPath: './machines/tuned_mass_damper.js', importName: 'createTunedMassDamper' },
  { id: 't_cell_activation', name: 'Cell Activation', icon: '&#x2699;&#xFE0F;', category: 't', importPath: './machines/t_cell_activation.js', importName: 'createTCellActivation' },
  { id: 't_rex_skeleton_assembly', name: 'Rex Skeleton Assembly', icon: '&#x2699;&#xFE0F;', category: 't', importPath: './machines/t_rex_skeleton_assembly.js', importName: 'createTRexSkeletonAssembly' },
  { id: 'vaccine-cold-chain', name: 'Vaccine-Cold-Chain', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/vaccine-cold-chain.js', importName: 'createVaccineColdChainDeliverySystem' },
  { id: 'vaccine_memory_response', name: 'Memory Response', icon: '&#x2699;&#xFE0F;', category: 'vaccine', importPath: './machines/vaccine_memory_response.js', importName: 'createVaccineMemory' },
  { id: 'vasimr_engine', name: 'Vasimr Engine', icon: '&#x2699;&#xFE0F;', category: 'plasma_propulsion', importPath: './machines/vasimr_engine.js', importName: 'createVasimrEngine' },
  { id: 'venus_flytrap', name: 'Flytrap', icon: '&#x2699;&#xFE0F;', category: 'venus', importPath: './machines/venus_flytrap.js', importName: 'createVenusFlytrap' },
  { id: 'vintage_antikythera_mechanism', name: 'Antikythera Mechanism', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_antikythera_mechanism.js', importName: 'createAntikytheraMechanism' },
  { id: 'vintage_camera_flashbulb', name: 'Camera Flashbulb', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_camera_flashbulb.js', importName: 'createFlashbulbSynchronizer' },
  { id: 'vintage_camera_instant', name: 'Camera Instant', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_camera_instant.js', importName: 'createInstantFilmMechanism' },
  { id: 'vintage_camera_rangefinder', name: 'Camera Rangefinder', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_camera_rangefinder.js', importName: 'createRangefinderMechanism' },
  { id: 'vintage_camera_tlr', name: 'Camera Tlr', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_camera_tlr.js', importName: 'createTwinLensReflex' },
  { id: 'vintage_camera_view', name: 'Camera View', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_camera_view.js', importName: 'createLargeFormatViewCamera' },
  { id: 'vintage_core_memory_matrix', name: 'Core Memory Matrix', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_core_memory_matrix.js', importName: 'createCoreMemoryMatrix' },
  { id: 'vintage_punch_card_reader', name: 'Punch Card Reader', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_punch_card_reader.js', importName: 'createPunchCardReader' },
  { id: 'vintage_turing_bombe', name: 'Turing Bombe', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_turing_bombe.js', importName: 'createTuringBombe' },
  { id: 'vintage_vacuum_tube_logic', name: 'Vacuum Tube Logic', icon: '&#x2699;&#xFE0F;', category: 'vintage', importPath: './machines/vintage_vacuum_tube_logic.js', importName: 'createVacuumTubeLogicGate' },
  { id: 'viral-transmission-simulator', name: 'Viral-Transmission-Simulator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/viral-transmission-simulator.js', importName: 'createViralTransmissionSimulator' },
  { id: 'virology_adenovirus', name: 'Adenovirus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/virology_adenovirus.js', importName: 'createAdenovirus' },
  { id: 'virology_bacteriophage', name: 'Bacteriophage', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/virology_bacteriophage.js', importName: 'createBacteriophage' },
  { id: 'virology_coronavirus', name: 'Coronavirus', icon: '&#x2699;&#xFE0F;', category: 'virology', importPath: './machines/virology_coronavirus.js', importName: 'createCoronavirus' },
  { id: 'virtual_memory_manager', name: 'Memory Manager', icon: '&#x2699;&#xFE0F;', category: 'virtual', importPath: './machines/virtual_memory_manager.js', importName: 'createVirtualMemoryManager' },
  { id: 'volcanology_ash_plume', name: 'Ash Plume', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_ash_plume.js', importName: 'createAshPlume' },
  { id: 'volcanology_magma_chamber', name: 'Magma Chamber', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_magma_chamber.js', importName: 'createMagmaChamber' },
  { id: 'volcanology_seismometer', name: 'Seismometer', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_seismometer.js', importName: 'createSeismometerStation' },
  { id: 'volcanology_shield_volcano', name: 'Shield Volcano', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_shield_volcano.js', importName: 'createShieldVolcano' },
  { id: 'volcanology_stratovolcano', name: 'Stratovolcano', icon: '&#x2699;&#xFE0F;', category: 'volcanology', importPath: './machines/volcanology_stratovolcano.js', importName: 'createStratovolcano' },
  { id: 'volcano_caldera', name: 'Caldera', icon: '&#x2699;&#xFE0F;', category: 'volcano', importPath: './machines/volcano_caldera.js', importName: 'createVolcanoCaldera' },
  { id: 'volcano_monitoring', name: 'Monitoring', icon: '&#x2699;&#xFE0F;', category: 'volcano', importPath: './machines/volcano_monitoring.js', importName: 'createVolcanoMonitoring' },
  { id: 'wankel_engine', name: 'Engine', icon: '&#x2699;&#xFE0F;', category: 'wankel', importPath: './machines/wankel_engine.js', importName: 'createWankelEngine' },
  { id: 'water_treatment', name: 'Treatment', icon: '&#x2699;&#xFE0F;', category: 'water', importPath: './machines/water_treatment.js', importName: 'createWaterTreatment' },
  { id: 'wave_energy_converter', name: 'Energy Converter', icon: '&#x2699;&#xFE0F;', category: 'wave', importPath: './machines/wave_energy_converter.js', importName: 'createWaveEnergyConverter' },
  { id: 'weaponry_cannon_recoil', name: 'Cannon Recoil', icon: '&#x2699;&#xFE0F;', category: 'weaponry', importPath: './machines/weaponry_cannon_recoil.js', importName: 'createCannonRecoil' },
  { id: 'weaponry_crossbow_trigger', name: 'Crossbow Trigger', icon: '&#x2699;&#xFE0F;', category: 'weaponry', importPath: './machines/weaponry_crossbow_trigger.js', importName: 'createCrossbowTrigger' },
  { id: 'weaponry_flintlock', name: 'Flintlock', icon: '&#x2699;&#xFE0F;', category: 'weaponry', importPath: './machines/weaponry_flintlock.js', importName: 'createFlintlock' },
  { id: 'weaponry_matchlock', name: 'Matchlock', icon: '&#x2699;&#xFE0F;', category: 'weaponry', importPath: './machines/weaponry_matchlock.js', importName: 'createMatchlock' },
  { id: 'weaponry_wheel_lock', name: 'Wheel Lock', icon: '&#x2699;&#xFE0F;', category: 'weaponry', importPath: './machines/weaponry_wheel_lock.js', importName: 'createWheelLock' },
  { id: 'weather_satellite', name: 'Satellite', icon: '&#x2699;&#xFE0F;', category: 'weather', importPath: './machines/weather_satellite.js', importName: 'createWeatherSatellite' },
  { id: 'wind_tunnel', name: 'Tunnel', icon: '&#x2699;&#xFE0F;', category: 'wind', importPath: './machines/wind_tunnel.js', importName: 'createWindTunnel' },
  { id: 'wind_turbine', name: 'Turbine', icon: '&#x2699;&#xFE0F;', category: 'wind', importPath: './machines/wind_turbine.js', importName: 'createWindTurbine' },
  { id: 'woodworking_band_saw', name: 'Band Saw', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_band_saw.js', importName: 'createBandSaw' },
  { id: 'woodworking_floor_drill_press', name: 'Floor Drill Press', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_floor_drill_press.js', importName: 'createFloorDrillPress' },
  { id: 'woodworking_table_saw', name: 'Table Saw', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_table_saw.js', importName: 'createTableSaw' },
  { id: 'woodworking_thickness_planer', name: 'Thickness Planer', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_thickness_planer.js', importName: 'createThicknessPlaner' },
  { id: 'woodworking_wood_lathe', name: 'Wood Lathe', icon: '&#x2699;&#xFE0F;', category: 'woodworking', importPath: './machines/woodworking_wood_lathe.js', importName: 'createWoodLathe' },
  { id: 'xenodynamics_gravity_inverter', name: 'Gravity Inverter', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_gravity_inverter.js', importName: 'createGravityInverter' },
  { id: 'xenodynamics_plasma_conduit', name: 'Plasma Conduit', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_plasma_conduit.js', importName: 'createPlasmaConduit' },
  { id: 'xenodynamics_quantum_resonator', name: 'Quantum Resonator', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_quantum_resonator.js', importName: 'createQuantumResonator' },
  { id: 'xenodynamics_tesseract_engine', name: 'Tesseract Engine', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_tesseract_engine.js', importName: 'createTesseractEngine' },
  { id: 'xenodynamics_warp_core', name: 'Warp Core', icon: '&#x2699;&#xFE0F;', category: 'xenodynamics', importPath: './machines/xenodynamics_warp_core.js', importName: 'createWarpCore' },
  { id: 'zoetrope_cylinder', name: 'Cylinder', icon: '&#x2699;&#xFE0F;', category: 'zoetrope', importPath: './machines/zoetrope_cylinder.js', importName: 'createZoetrope' },
  { id: 'aerodynamics_rotor_blade', name: 'Rotor Blade', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_rotor_blade.js', importName: 'createRotorBlade' },
  { id: 'aerodynamics_supersonic_cone', name: 'Supersonic Cone', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_supersonic_cone.js', importName: 'createSupersonicCone' },
  { id: 'aerodynamics_vortex_generator', name: 'Vortex Generator', icon: '&#x2699;&#xFE0F;', category: 'aerodynamics', importPath: './machines/aerodynamics_vortex_generator.js', importName: 'createVortexGenerator' },
  { id: 'aerospace_deployable_solar_array_v1', name: 'Deployable Solar Array V1', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_deployable_solar_array_v1.js', importName: 'createDeployableSolarArray' },
  { id: 'aerospace_ion_thruster_v2', name: 'Ion Thruster V2', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_ion_thruster_v2.js', importName: 'createIonThruster' },
  { id: 'aerospace_lunar_lander_module_v1', name: 'Lunar Lander Module V1', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_lunar_lander_module_v1.js', importName: 'createLunarLanderModule' },
  { id: 'aerospace_reaction_wheel_assembly_v1', name: 'Reaction Wheel Assembly V1', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_reaction_wheel_assembly_v1.js', importName: 'createReactionWheelAssembly' },
  { id: 'aerospace_scramjet_engine_v1', name: 'Scramjet Engine V1', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_scramjet_engine_v1.js', importName: 'createScramjetEngine' },
  { id: 'astrophysics_gravitational_wave_detector', name: 'Gravitational Wave Detector', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_gravitational_wave_detector.js', importName: 'createGravitationalWaveDetector' },
  { id: 'astrophysics_mars_rover', name: 'Mars Rover', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_mars_rover.js', importName: 'createMarsRover' },
  { id: 'astrophysics_orbital_satellite', name: 'Orbital Satellite', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_orbital_satellite.js', importName: 'createOrbitalSatellite' },
  { id: 'astrophysics_radio_telescope', name: 'Radio Telescope', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_radio_telescope.js', importName: 'createRadioTelescope' },
  { id: 'astrophysics_space_station', name: 'Space Station', icon: '&#x2699;&#xFE0F;', category: 'astrophysics', importPath: './machines/astrophysics_space_station.js', importName: 'createSpaceStation' },
  { id: 'civil_cantilever_bridge_segment', name: 'Cantilever Bridge Segment', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_cantilever_bridge_segment.js', importName: 'createCantileverBridgeSegment' },
  { id: 'civil_gabion_wall_module', name: 'Gabion Wall Module', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_gabion_wall_module.js', importName: 'createGabionWallModule' },
  { id: 'civil_post_tensioning_jack', name: 'Post Tensioning Jack', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_post_tensioning_jack.js', importName: 'createPostTensioningJack' },
  { id: 'civil_tremie_pipe_system', name: 'Tremie Pipe System', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tremie_pipe_system.js', importName: 'createTremiePipeSystem' },
  { id: 'civil_vibratory_pile_driver', name: 'Vibratory Pile Driver', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_vibratory_pile_driver.js', importName: 'createVibratoryPileDriver' },
  { id: 'meteorology_anemometer_tower', name: 'Anemometer Tower', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_anemometer_tower.js', importName: 'createAnemometerTower' },
  { id: 'meteorology_lidar_profiler', name: 'Lidar Profiler', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_lidar_profiler.js', importName: 'createLidarProfiler' },
  { id: 'meteorology_radiosonde_balloon', name: 'Radiosonde Balloon', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_radiosonde_balloon.js', importName: 'createRadiosondeBalloon' },
  { id: 'oceanography_autonomous_underwater_glider', name: 'Autonomous Underwater Glider', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_autonomous_underwater_glider.js', importName: 'createAutonomousUnderwaterGlider' },
  { id: 'oceanography_deep_sea_submersible', name: 'Deep Sea Submersible', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_deep_sea_submersible.js', importName: 'createDeepSeaSubmersible' },
  { id: 'oceanography_seafloor_drill_rig', name: 'Seafloor Drill Rig', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_seafloor_drill_rig.js', importName: 'createSeafloorDrillRig' },
  { id: 'oceanography_tidal_energy_turbine', name: 'Tidal Energy Turbine', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_tidal_energy_turbine.js', importName: 'createTidalEnergyTurbine' },
  { id: 'oceanography_wave_buoy_sensor', name: 'Wave Buoy Sensor', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/oceanography_wave_buoy_sensor.js', importName: 'createWaveBuoySensor' },
  { id: 'optics_adaptive_telescope', name: 'Adaptive Telescope', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_adaptive_telescope.js', importName: 'createAdaptiveTelescope' },
  { id: 'optics_fiber_amplifier', name: 'Fiber Amplifier', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_fiber_amplifier.js', importName: 'createFiberAmplifier' },
  { id: 'quantum_computer_core', name: 'Computer Core', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_computer_core.js', importName: 'createQuantumComputerCore' },
  { id: 'quantum_entanglement_generator', name: 'Entanglement Generator', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_entanglement_generator.js', importName: 'createQuantumEntanglementGenerator' },
  { id: 'quantum_teleportation_chamber', name: 'Teleportation Chamber', icon: '&#x2699;&#xFE0F;', category: 'quantum', importPath: './machines/quantum_teleportation_chamber.js', importName: 'createQuantumTeleportationChamber' },
  { id: 'superconducting_qubit_array', name: 'Qubit Array', icon: '&#x2699;&#xFE0F;', category: 'superconducting', importPath: './machines/superconducting_qubit_array.js', importName: 'createSuperconductingQubitArray' },
  { id: 'topological_quantum_gate', name: 'Quantum Gate', icon: '&#x2699;&#xFE0F;', category: 'topological', importPath: './machines/topological_quantum_gate.js', importName: 'createTopologicalQuantumGate' },
  { id: 'agri_hydroponic_nutrient_mixer', name: 'Hydroponic Nutrient Mixer', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agri_hydroponic_nutrient_mixer.js', importName: 'createHydroponicNutrientMixer' },
  { id: 'agri_precision_drone_sprayer', name: 'Precision Drone Sprayer', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agri_precision_drone_sprayer.js', importName: 'createPrecisionDroneSprayer' },
  { id: 'agri_robotic_combine_harvester', name: 'Robotic Combine Harvester', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agri_robotic_combine_harvester.js', importName: 'createRoboticCombineHarvester' },
  { id: 'agri_smart_greenhouse_climate_control', name: 'Smart Greenhouse Climate Control', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agri_smart_greenhouse_climate_control.js', importName: 'createSmartGreenhouseClimateControl' },
  { id: 'agri_vertical_farm_tower', name: 'Vertical Farm Tower', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agri_vertical_farm_tower.js', importName: 'createVerticalFarmTower' },
  { id: 'enviro_bioremediation_reactor', name: 'Bioremediation Reactor', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/enviro_bioremediation_reactor.js', importName: 'createBioremediationReactor' },
  { id: 'enviro_desalination_plant', name: 'Desalination Plant', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/enviro_desalination_plant.js', importName: 'createDesalinationPlant' },
  { id: 'enviro_ocean_carbon_capture', name: 'Ocean Carbon Capture', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/enviro_ocean_carbon_capture.js', importName: 'createDirectOceanCarbonCaptureSystem' },
  { id: 'enviro_waste_sorting_facility', name: 'Waste Sorting Facility', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/enviro_waste_sorting_facility.js', importName: 'createAutomatedWasteSortingFacility' },
  { id: 'enviro_water_filtration_plant', name: 'Water Filtration Plant', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/enviro_water_filtration_plant.js', importName: 'createAdvancedWaterFiltrationPlant' },
  { id: 'flow_cytometer', name: 'Cytometer', icon: '&#x2699;&#xFE0F;', category: 'flow', importPath: './machines/flow_cytometer.js', importName: 'createFlowCytometer' },
  { id: 'fusion_inertial_confinement', name: 'Inertial Confinement', icon: '&#x2699;&#xFE0F;', category: 'fusion_energy', importPath: './machines/fusion_inertial_confinement.js', importName: 'createInertialConfinement' },
  { id: 'fusion_plasma_injector', name: 'Plasma Injector', icon: '&#x2699;&#xFE0F;', category: 'fusion_energy', importPath: './machines/fusion_plasma_injector.js', importName: 'createPlasmaInjector' },
  { id: 'fusion_stellarator_configuration', name: 'Stellarator Configuration', icon: '&#x2699;&#xFE0F;', category: 'fusion_energy', importPath: './machines/fusion_stellarator_configuration.js', importName: 'createStellaratorConfiguration' },
  { id: 'fusion_superconducting_coil', name: 'Superconducting Coil', icon: '&#x2699;&#xFE0F;', category: 'fusion_energy', importPath: './machines/fusion_superconducting_coil.js', importName: 'createSuperconductingCoil' },
  { id: 'fusion_tokamak_reactor', name: 'Tokamak Reactor', icon: '&#x2699;&#xFE0F;', category: 'fusion_energy', importPath: './machines/fusion_tokamak_reactor.js', importName: 'createTokamakReactor' },
  { id: 'heart', name: 'Heart', icon: '&#x2699;&#xFE0F;', category: 'heart', importPath: './machines/heart.js', importName: 'createHeart' },
  { id: 'marine_auv', name: 'Auv', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_auv.js', importName: 'createAUV' },
  { id: 'marine_deep_sea_rov', name: 'Deep Sea Rov', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_deep_sea_rov.js', importName: 'createDeepSeaROV' },
  { id: 'marine_offshore_oil_platform', name: 'Offshore Oil Platform', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_offshore_oil_platform.js', importName: 'createOffshoreOilPlatform' },
  { id: 'marine_submarine_pressure_hull', name: 'Submarine Pressure Hull', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_submarine_pressure_hull.js', importName: 'createSubmarinePressureHull' },
  { id: 'marine_wave_energy_converter', name: 'Wave Energy Converter', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_wave_energy_converter.js', importName: 'createWaveEnergyConverter' },
  { id: 'mining_automated_haul_truck', name: 'Automated Haul Truck', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_automated_haul_truck.js', importName: 'createAutomatedHaulTruck' },
  { id: 'mining_deep_shaft_elevator', name: 'Deep Shaft Elevator', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_deep_shaft_elevator.js', importName: 'createDeepShaftElevator' },
  { id: 'mining_ore_crusher_plant', name: 'Ore Crusher Plant', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_ore_crusher_plant.js', importName: 'createOreCrusherPlant' },
  { id: 'mining_tunnel_boring_machine', name: 'Tunnel Boring Machine', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_tunnel_boring_machine.js', importName: 'createTunnelBoringMachine' },
  { id: 'nano_robotics_carbon_nanotube_actuator', name: 'Robotics Carbon Nanotube Actuator', icon: '&#x2699;&#xFE0F;', category: 'nano_robotics', importPath: './machines/nano_robotics_carbon_nanotube_actuator.js', importName: 'createCarbonNanotubeActuator' },
  { id: 'nano_robotics_dna_origami_motor', name: 'Robotics Dna Origami Motor', icon: '&#x2699;&#xFE0F;', category: 'nano_robotics', importPath: './machines/nano_robotics_dna_origami_motor.js', importName: 'createDnaOrigamiMotor' },
  { id: 'nano_robotics_medical_nanobot', name: 'Robotics Medical Nanobot', icon: '&#x2699;&#xFE0F;', category: 'nano_robotics', importPath: './machines/nano_robotics_medical_nanobot.js', importName: 'createMedicalNanobot' },
  { id: 'nano_robotics_molecular_assembler', name: 'Robotics Molecular Assembler', icon: '&#x2699;&#xFE0F;', category: 'nano_robotics', importPath: './machines/nano_robotics_molecular_assembler.js', importName: 'createMolecularAssembler' },
  { id: 'nano_robotics_nanoscale_sensor_array', name: 'Robotics Nanoscale Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'nano_robotics', importPath: './machines/nano_robotics_nanoscale_sensor_array.js', importName: 'createNanoscaleSensorArray' },
  { id: 'neuro_artificial_synapse', name: 'Artificial Synapse', icon: '&#x2699;&#xFE0F;', category: 'neuromorphic_engineering', importPath: './machines/neuro_artificial_synapse.js', importName: 'createArtificialSynapseArray' },
  { id: 'neuro_bci_probe', name: 'Bci Probe', icon: '&#x2699;&#xFE0F;', category: 'neuromorphic_engineering', importPath: './machines/neuro_bci_probe.js', importName: 'createBrainComputerInterfaceProbe' },
  { id: 'neuro_bionic_eye', name: 'Bionic Eye', icon: '&#x2699;&#xFE0F;', category: 'neuromorphic_engineering', importPath: './machines/neuro_bionic_eye.js', importName: 'createBionicEyeImplant' },
  { id: 'neuro_memristor_crossbar', name: 'Memristor Crossbar', icon: '&#x2699;&#xFE0F;', category: 'neuromorphic_engineering', importPath: './machines/neuro_memristor_crossbar.js', importName: 'createMemristorCrossbar' },
  { id: 'neuro_spiking_core', name: 'Spiking Core', icon: '&#x2699;&#xFE0F;', category: 'neuromorphic_engineering', importPath: './machines/neuro_spiking_core.js', importName: 'createSpikingNeuralNetworkCore' },
  { id: 'respiratory_system', name: 'System', icon: '&#x2699;&#xFE0F;', category: 'respiratory', importPath: './machines/respiratory_system.js', importName: 'createRespiratorySystem' },
  { id: 'smart_electrochromic_window', name: 'Electrochromic Window', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_electrochromic_window.js', importName: 'createElectrochromicWindow' },
  { id: 'smart_piezoelectric_harvester', name: 'Piezoelectric Harvester', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_piezoelectric_harvester.js', importName: 'createPiezoelectricHarvester' },
  { id: 'smart_self_healing_concrete', name: 'Self Healing Concrete', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_self_healing_concrete.js', importName: 'createSelfHealingConcrete' },
  { id: 'smart_shape_memory_alloy', name: 'Shape Memory Alloy', icon: '&#x2699;&#xFE0F;', category: 'smart_materials', importPath: './machines/smart_shape_memory_alloy.js', importName: 'createShapeMemoryAlloy' },
  { id: 'telecom_cell_tower', name: 'Cell Tower', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_cell_tower.js', importName: 'createCellTower' },
  { id: 'telecom_fiber_optic_repeater', name: 'Fiber Optic Repeater', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_fiber_optic_repeater.js', importName: 'createFiberOpticRepeater' },
  { id: 'telecom_geostationary_satellite', name: 'Geostationary Satellite', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_geostationary_satellite.js', importName: 'createGeostationarySatellite' },
  { id: 'telecom_microwave_relay', name: 'Microwave Relay', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_microwave_relay.js', importName: 'createMicrowaveRelay' },
  { id: 'telecom_quantum_key_hub', name: 'Quantum Key Hub', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_quantum_key_hub.js', importName: 'createQuantumKeyHub' },
  { id: 'tidal_turbine', name: 'Turbine', icon: '&#x2699;&#xFE0F;', category: 'tidal', importPath: './machines/tidal_turbine.js', importName: 'createTidalTurbine' },
  { id: 'transformer', name: 'Transformer', icon: '&#x2699;&#xFE0F;', category: 'transformer', importPath: './machines/transformer.js', importName: 'createTransformer' },
  { id: 'volcano', name: 'Volcano', icon: '&#x2699;&#xFE0F;', category: 'volcano', importPath: './machines/volcano.js', importName: 'createVolcano' },
  { id: 'aerospace_helicopter_rotor', name: 'Helicopter Rotor', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_helicopter_rotor.js', importName: 'createHelicopterRotorHead' },
  { id: 'aerospace_landing_gear', name: 'Landing Gear', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_landing_gear.js', importName: 'createLandingGearAssembly' },
  { id: 'aerospace_rocket_gimbal', name: 'Rocket Gimbal', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_rocket_gimbal.js', importName: 'createRocketEngineGimbal' },
  { id: 'aerospace_scramjet_engine', name: 'Scramjet Engine', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_scramjet_engine.js', importName: 'createScramjetEngine' },
  { id: 'aerospace_turbofan_engine', name: 'Turbofan Engine', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_turbofan_engine.js', importName: 'createTurbofanJetEngine' },
  { id: 'bose_einstein_condensate_chamber', name: 'Einstein Condensate Chamber', icon: '&#x2699;&#xFE0F;', category: 'bose', importPath: './machines/bose_einstein_condensate_chamber.js', importName: 'createBoseEinsteinCondensateChamber' },
  { id: 'civil_tbm_erector', name: 'Tbm Erector', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tbm_erector.js', importName: 'createTBMErector' },
  { id: 'electrical_capacitor_bank', name: 'Capacitor Bank', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_capacitor_bank.js', importName: 'createCapacitorBank' },
  { id: 'electrical_solenoid_actuator', name: 'Solenoid Actuator', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_solenoid_actuator.js', importName: 'createSolenoidActuator' },
  { id: 'electrical_substation_switch', name: 'Substation Switch', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_substation_switch.js', importName: 'createSubstationSwitch' },
  { id: 'electrical_tesla_coil', name: 'Tesla Coil', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_tesla_coil.js', importName: 'createTeslaCoil' },
  { id: 'mach_zehnder_interferometer', name: 'Zehnder Interferometer', icon: '&#x2699;&#xFE0F;', category: 'mach', importPath: './machines/mach_zehnder_interferometer.js', importName: 'createMachZehnderInterferometer' },
  { id: 'materials_atomic_force_microscope', name: 'Atomic Force Microscope', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_atomic_force_microscope.js', importName: 'createAFM' },
  { id: 'materials_rheometer', name: 'Rheometer', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_rheometer.js', importName: 'createRheometer' },
  { id: 'materials_sem_microscope', name: 'Sem Microscope', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_sem_microscope.js', importName: 'createSEM' },
  { id: 'materials_sputtering_deposition_chamber', name: 'Sputtering Deposition Chamber', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_sputtering_deposition_chamber.js', importName: 'createSputteringChamber' },
  { id: 'materials_tensile_testing_machine', name: 'Tensile Testing Machine', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_tensile_testing_machine.js', importName: 'createTensileTestingMachine' },
  { id: 'mechanical_centrifugal_pump', name: 'Centrifugal Pump', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_centrifugal_pump.js', importName: 'createCentrifugalPump' },
  { id: 'mechanical_differential_gear', name: 'Differential Gear', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_differential_gear.js', importName: 'createDifferentialGear' },
  { id: 'mechanical_hydraulic_press', name: 'Hydraulic Press', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_hydraulic_press.js', importName: 'createHydraulicPress' },
  { id: 'mechanical_planetary_gearset', name: 'Planetary Gearset', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_planetary_gearset.js', importName: 'createPlanetaryGearset' },
  { id: 'mechanical_steam_turbine', name: 'Steam Turbine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_steam_turbine.js', importName: 'createSteamTurbineRotor' },
  { id: 'nuclear_control_rods', name: 'Control Rods', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_control_rods.js', importName: 'createControlRods' },
  { id: 'nuclear_molten_salt_loop', name: 'Molten Salt Loop', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_molten_salt_loop.js', importName: 'createMoltenSaltLoop' },
  { id: 'nuclear_neutron_source', name: 'Neutron Source', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_neutron_source.js', importName: 'createNeutronSource' },
  { id: 'nuclear_rtg_generator', name: 'Rtg Generator', icon: '&#x2699;&#xFE0F;', category: 'nuclear', importPath: './machines/nuclear_rtg_generator.js', importName: 'createRTG' },
  { id: 'optics_adaptive_mirror', name: 'Adaptive Mirror', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_adaptive_mirror.js', importName: 'createAdaptiveOpticsMirror' },
  { id: 'optics_femtosecond_laser', name: 'Femtosecond Laser', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_femtosecond_laser.js', importName: 'createFemtosecondLaserSystem' },
  { id: 'optics_interferometer', name: 'Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_interferometer.js', importName: 'createInterferometerSetup' },
  { id: 'optics_pockels_cell', name: 'Pockels Cell', icon: '&#x2699;&#xFE0F;', category: 'optics', importPath: './machines/optics_pockels_cell.js', importName: 'createPockelsCellModulator' },
  { id: 'penning_trap', name: 'Trap', icon: '&#x2699;&#xFE0F;', category: 'penning', importPath: './machines/penning_trap.js', importName: 'createPenningTrap' },
  { id: 'quantum_eraser_experiment', name: 'Eraser Experiment', icon: '&#x2699;&#xFE0F;', category: 'quantum_physics', importPath: './machines/quantum_eraser_experiment.js', importName: 'createQuantumEraser' },
  { id: 'robotics_delta_robot', name: 'Delta Robot', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_delta_robot.js', importName: 'createDeltaRobot' },
  { id: 'robotics_drone_swarm', name: 'Drone Swarm', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_drone_swarm.js', importName: 'createDroneSwarm' },
  { id: 'robotics_gripper_array', name: 'Gripper Array', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_gripper_array.js', importName: 'createGripperArray' },
  { id: 'robotics_omni_rover', name: 'Omni Rover', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_omni_rover.js', importName: 'createOmniRover' },
  { id: 'robotics_quadruped', name: 'Quadruped', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_quadruped.js', importName: 'createQuadruped' },
  { id: 'superconducting_qubit', name: 'Qubit', icon: '&#x2699;&#xFE0F;', category: 'superconducting', importPath: './machines/superconducting_qubit.js', importName: 'createSuperconductingQubit' },
  { id: 'acoustics_anc_head', name: 'Anc Head', icon: '&#x2699;&#xFE0F;', category: 'acoustics_engineering', importPath: './machines/acoustics_anc_head.js', importName: 'createANCHead' },
  { id: 'acoustics_anechoic_chamber', name: 'Anechoic Chamber', icon: '&#x2699;&#xFE0F;', category: 'acoustics_engineering', importPath: './machines/acoustics_anechoic_chamber.js', importName: 'createAnechoicChamber' },
  { id: 'acoustics_metamaterial_panel', name: 'Metamaterial Panel', icon: '&#x2699;&#xFE0F;', category: 'acoustics_engineering', importPath: './machines/acoustics_metamaterial_panel.js', importName: 'createMetamaterialPanel' },
  { id: 'acoustics_parametric_speaker', name: 'Parametric Speaker', icon: '&#x2699;&#xFE0F;', category: 'acoustics_engineering', importPath: './machines/acoustics_parametric_speaker.js', importName: 'createParametricSpeaker' },
  { id: 'acoustics_sonic_levitator', name: 'Sonic Levitator', icon: '&#x2699;&#xFE0F;', category: 'acoustics_engineering', importPath: './machines/acoustics_sonic_levitator.js', importName: 'createSonicLevitator' },
  { id: 'clean_agent_gas_cylinder_rack', name: 'Agent Gas Cylinder Rack', icon: '&#x2699;&#xFE0F;', category: 'clean', importPath: './machines/clean_agent_gas_cylinder_rack.js', importName: 'createCleanAgentGasCylinderRack' },
  { id: 'cryo_cryopump_array', name: 'Cryopump Array', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryo_cryopump_array.js', importName: 'createCryopumpArray' },
  { id: 'cryo_helium_liquefier', name: 'Helium Liquefier', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryo_helium_liquefier.js', importName: 'createHeliumLiquefier' },
  { id: 'cryo_superconducting_magnet', name: 'Superconducting Magnet', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryo_superconducting_magnet.js', importName: 'createSuperconductingMagnetDewar' },
  { id: 'cryo_wind_tunnel_core', name: 'Wind Tunnel Core', icon: '&#x2699;&#xFE0F;', category: 'cryogenics', importPath: './machines/cryo_wind_tunnel_core.js', importName: 'createCryogenicWindTunnelCore' },
  { id: 'deluge_sprinkler_array', name: 'Sprinkler Array', icon: '&#x2699;&#xFE0F;', category: 'deluge', importPath: './machines/deluge_sprinkler_array.js', importName: 'createDelugeSprinklerArray' },
  { id: 'fire_pump_controller_panel', name: 'Pump Controller Panel', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_pump_controller_panel.js', importName: 'createFirePumpControllerPanel' },
  { id: 'food_automated_bottling_carousel', name: 'Automated Bottling Carousel', icon: '&#x2699;&#xFE0F;', category: 'food_engineering', importPath: './machines/food_automated_bottling_carousel.js', importName: 'createAutomatedBottlingCarousel' },
  { id: 'food_freeze_drying_lyophilizer', name: 'Freeze Drying Lyophilizer', icon: '&#x2699;&#xFE0F;', category: 'food_engineering', importPath: './machines/food_freeze_drying_lyophilizer.js', importName: 'createFreezeDryingLyophilizer' },
  { id: 'food_htst_pasteurizer', name: 'Htst Pasteurizer', icon: '&#x2699;&#xFE0F;', category: 'food_engineering', importPath: './machines/food_htst_pasteurizer.js', importName: 'createHTSTPasteurizer' },
  { id: 'food_spray_drying_chamber', name: 'Spray Drying Chamber', icon: '&#x2699;&#xFE0F;', category: 'food_engineering', importPath: './machines/food_spray_drying_chamber.js', importName: 'createSprayDryingChamber' },
  { id: 'food_twin_screw_extruder', name: 'Twin Screw Extruder', icon: '&#x2699;&#xFE0F;', category: 'food_engineering', importPath: './machines/food_twin_screw_extruder.js', importName: 'createTwinScrewExtruder' },
  { id: 'geotech_deep_rock_anchor', name: 'Deep Rock Anchor', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_deep_rock_anchor.js', importName: 'createDeepRockAnchorMechanism' },
  { id: 'geotech_dynamic_compactor', name: 'Dynamic Compactor', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_dynamic_compactor.js', importName: 'createDynamicCompactor' },
  { id: 'geotech_earth_pressure_shield', name: 'Earth Pressure Shield', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_earth_pressure_shield.js', importName: 'createEarthPressureBalanceShield' },
  { id: 'geotech_inclinometer_probe', name: 'Inclinometer Probe', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_inclinometer_probe.js', importName: 'createInclinometerProbe' },
  { id: 'geotech_soil_stabilizer', name: 'Soil Stabilizer', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_soil_stabilizer.js', importName: 'createSoilStabilizer' },
  { id: 'high_expansion_foam_generator', name: 'Expansion Foam Generator', icon: '&#x2699;&#xFE0F;', category: 'high', importPath: './machines/high_expansion_foam_generator.js', importName: 'createHighExpansionFoamGenerator' },
  { id: 'petro_flare_gas_recovery', name: 'Flare Gas Recovery', icon: '&#x2699;&#xFE0F;', category: 'petrochemical_engineering', importPath: './machines/petro_flare_gas_recovery.js', importName: 'createFlareGasRecoverySystem' },
  { id: 'petro_floating_roof_tank', name: 'Floating Roof Tank', icon: '&#x2699;&#xFE0F;', category: 'petrochemical_engineering', importPath: './machines/petro_floating_roof_tank.js', importName: 'createFloatingRoofTank' },
  { id: 'petro_fluid_catalytic_cracker', name: 'Fluid Catalytic Cracker', icon: '&#x2699;&#xFE0F;', category: 'petrochemical_engineering', importPath: './machines/petro_fluid_catalytic_cracker.js', importName: 'createFluidCatalyticCracker' },
  { id: 'petro_fractionating_column', name: 'Fractionating Column', icon: '&#x2699;&#xFE0F;', category: 'petrochemical_engineering', importPath: './machines/petro_fractionating_column.js', importName: 'createFractionatingColumn' },
  { id: 'petro_hydrodesulfurization_reactor', name: 'Hydrodesulfurization Reactor', icon: '&#x2699;&#xFE0F;', category: 'petrochemical_engineering', importPath: './machines/petro_hydrodesulfurization_reactor.js', importName: 'createHydrodesulfurizationReactor' },
  { id: 'plasma_dense_focus', name: 'Dense Focus', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_dense_focus.js', importName: 'createDensePlasmaFocus' },
  { id: 'plasma_etching_chamber', name: 'Etching Chamber', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_etching_chamber.js', importName: 'createPlasmaEtchingChamber' },
  { id: 'plasma_hall_thruster', name: 'Hall Thruster', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_hall_thruster.js', importName: 'createHallEffectThruster' },
  { id: 'plasma_helicon_source', name: 'Helicon Source', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_helicon_source.js', importName: 'createHeliconPlasmaSource' },
  { id: 'plasma_magnetic_mirror', name: 'Magnetic Mirror', icon: '&#x2699;&#xFE0F;', category: 'plasma_physics', importPath: './machines/plasma_magnetic_mirror.js', importName: 'createMagneticMirror' },
  { id: 'renew_csp_tower', name: 'Csp Tower', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/renew_csp_tower.js', importName: 'createCSPTower' },
  { id: 'renew_geothermal_exchanger', name: 'Geothermal Exchanger', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/renew_geothermal_exchanger.js', importName: 'createGeothermalExchanger' },
  { id: 'renew_pumped_hydro', name: 'Pumped Hydro', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/renew_pumped_hydro.js', importName: 'createPumpedHydro' },
  { id: 'renew_tidal_barrage', name: 'Tidal Barrage', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/renew_tidal_barrage.js', importName: 'createTidalBarrage' },
  { id: 'renew_wind_turbine', name: 'Wind Turbine', icon: '&#x2699;&#xFE0F;', category: 'renewable_energy', importPath: './machines/renew_wind_turbine.js', importName: 'createWindTurbine' },
  { id: 'space_centrifuge_accommodation_module', name: 'Centrifuge Accommodation Module', icon: '&#x2699;&#xFE0F;', category: 'space_habitats', importPath: './machines/space_centrifuge_accommodation_module.js', importName: 'createCentrifugeAccommodationModule' },
  { id: 'space_inflatable_orbital_module', name: 'Inflatable Orbital Module', icon: '&#x2699;&#xFE0F;', category: 'space_habitats', importPath: './machines/space_inflatable_orbital_module.js', importName: 'createInflatableOrbitalModule' },
  { id: 'space_lunar_regolith_base', name: 'Lunar Regolith Base', icon: '&#x2699;&#xFE0F;', category: 'space_habitats', importPath: './machines/space_lunar_regolith_base.js', importName: 'createLunarRegolithBase' },
  { id: 'space_martian_hydroponic_dome', name: 'Martian Hydroponic Dome', icon: '&#x2699;&#xFE0F;', category: 'space_habitats', importPath: './machines/space_martian_hydroponic_dome.js', importName: 'createMartianHydroponicDome' },
  { id: 'space_oneill_cylinder', name: 'Oneill Cylinder', icon: '&#x2699;&#xFE0F;', category: 'space_habitats', importPath: './machines/space_oneill_cylinder.js', importName: 'createONeillCylinder' },
  { id: 'stairwell_pressurization_fan', name: 'Pressurization Fan', icon: '&#x2699;&#xFE0F;', category: 'stairwell', importPath: './machines/stairwell_pressurization_fan.js', importName: 'createStairwellPressurizationFan' },
  { id: 'aerospace_hypersonic_waverider_airframe', name: 'Hypersonic Waverider Airframe', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_hypersonic_waverider_airframe.js', importName: 'createHypersonicWaveriderAirframe' },
  { id: 'aerospace_ramjet_engine_core', name: 'Ramjet Engine Core', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_ramjet_engine_core.js', importName: 'createRamjetEngineCore' },
  { id: 'aerospace_spacecraft_docking_ring', name: 'Spacecraft Docking Ring', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_spacecraft_docking_ring.js', importName: 'createSpacecraftDockingRing' },
  { id: 'aerospace_supersonic_wind_tunnel', name: 'Supersonic Wind Tunnel', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_supersonic_wind_tunnel.js', importName: 'createSupersonicWindTunnel' },
  { id: 'aerospace_thrust_reverser', name: 'Thrust Reverser', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_thrust_reverser.js', importName: 'createThrustReverserMechanism' },
  { id: 'auto_disk_brake_caliper', name: 'Disk Brake Caliper', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_disk_brake_caliper.js', importName: 'createDiskBrakeCaliper' },
  { id: 'auto_double_wishbone', name: 'Double Wishbone', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_double_wishbone.js', importName: 'createDoubleWishbone' },
  { id: 'auto_exhaust_manifold', name: 'Exhaust Manifold', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_exhaust_manifold.js', importName: 'createExhaustManifold' },
  { id: 'auto_mcpherson_strut', name: 'Mcpherson Strut', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_mcpherson_strut.js', importName: 'createMcPhersonStrut' },
  { id: 'auto_turbocharger', name: 'Turbocharger', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_turbocharger.js', importName: 'createTurbocharger' },
  { id: 'chemical_absorption_column', name: 'Absorption Column', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_absorption_column.js', importName: 'createAbsorptionColumn' },
  { id: 'chemical_centrifuge', name: 'Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_centrifuge.js', importName: 'createCentrifugalSeparator' },
  { id: 'chemical_heat_exchanger', name: 'Heat Exchanger', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_heat_exchanger.js', importName: 'createPlateHeatExchanger' },
  { id: 'chemical_spray_dryer', name: 'Spray Dryer', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_spray_dryer.js', importName: 'createSprayDryerSystem' },
  { id: 'chemical_stirred_tank', name: 'Stirred Tank', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_stirred_tank.js', importName: 'createStirredTankReactor' },
  { id: 'civil_cantilever_bridge', name: 'Cantilever Bridge', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_cantilever_bridge.js', importName: 'createCantileverBridgeSection' },
  { id: 'civil_concrete_pump_boom', name: 'Concrete Pump Boom', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_concrete_pump_boom.js', importName: 'createConcretePumpingTruckBoom' },
  { id: 'civil_excavator_arm', name: 'Excavator Arm', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_excavator_arm.js', importName: 'createExcavatorArm' },
  { id: 'civil_road_grader', name: 'Road Grader', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_road_grader.js', importName: 'createRoadGraderBladeMechanism' },
  { id: 'civil_scaffolding', name: 'Scaffolding', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_scaffolding.js', importName: 'createScaffoldingSystem' },
  { id: 'electrical_commutator_dc_motor', name: 'Commutator Dc Motor', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_commutator_dc_motor.js', importName: 'createCommutatorDCMotor' },
  { id: 'electrical_stator_winding_machine', name: 'Stator Winding Machine', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_stator_winding_machine.js', importName: 'createStatorWindingMachine' },
  { id: 'electrical_three_phase_transformer_core', name: 'Three Phase Transformer Core', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_three_phase_transformer_core.js', importName: 'createThreePhaseTransformerCore' },
  { id: 'electrical_vacuum_circuit_breaker', name: 'Vacuum Circuit Breaker', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_vacuum_circuit_breaker.js', importName: 'createVacuumCircuitBreaker' },
  { id: 'hardware_core_memory_matrix', name: 'Core Memory Matrix', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_core_memory_matrix.js', importName: 'createCoreMemoryMatrix' },
  { id: 'hardware_cpu_heatsink_fan', name: 'Cpu Heatsink Fan', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_cpu_heatsink_fan.js', importName: 'createCpuHeatsinkFan' },
  { id: 'hardware_hard_disk_drive', name: 'Hard Disk Drive', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_hard_disk_drive.js', importName: 'createHardDiskDrive' },
  { id: 'hardware_mechanical_keyboard_switch', name: 'Mechanical Keyboard Switch', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_mechanical_keyboard_switch.js', importName: 'createMechanicalKeyboardSwitch' },
  { id: 'hardware_optical_disc_drive', name: 'Optical Disc Drive', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_optical_disc_drive.js', importName: 'createOpticalDiscDrive' },
  { id: 'materials_3d_metal_printer_chamber', name: '3D Metal Printer Chamber', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_3d_metal_printer_chamber.js', importName: 'create3DMetalPrinterChamber' },
  { id: 'materials_arc_melting_furnace', name: 'Arc Melting Furnace', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_arc_melting_furnace.js', importName: 'createArcMeltingFurnace' },
  { id: 'materials_hot_rolling_mill', name: 'Hot Rolling Mill', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_hot_rolling_mill.js', importName: 'createHotRollingMill' },
  { id: 'materials_impact_testing_pendulum', name: 'Impact Testing Pendulum', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_impact_testing_pendulum.js', importName: 'createImpactTestingPendulum' },
  { id: 'materials_xray_diffractometer', name: 'Xray Diffractometer', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_xray_diffractometer.js', importName: 'createXRayDiffractometer' },
  { id: 'mechanical_combustion_block', name: 'Combustion Block', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_combustion_block.js', importName: 'createInternalCombustionBlock' },
  { id: 'mechanical_cvt', name: 'Cvt', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_cvt.js', importName: 'createCVT' },
  { id: 'mechanical_rack_and_pinion', name: 'Rack And Pinion', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_rack_and_pinion.js', importName: 'createRackAndPinion' },
  { id: 'mechanical_stirling_engine', name: 'Stirling Engine', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_stirling_engine.js', importName: 'createStirlingEngine' },
  { id: 'mechanical_wankel_rotary', name: 'Wankel Rotary', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_wankel_rotary.js', importName: 'createWankelRotaryEngine' },
  { id: 'robotics_agv', name: 'Agv', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_agv.js', importName: 'createAGV' },
  { id: 'robotics_bipedal', name: 'Bipedal', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_bipedal.js', importName: 'createBipedalWalkingMechanism' },
  { id: 'robotics_hexapod', name: 'Hexapod', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_hexapod.js', importName: 'createHexapod' },
  { id: 'robotics_scara_arm', name: 'Scara Arm', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_scara_arm.js', importName: 'createSCARA' },
  { id: 'robotics_welding_cell', name: 'Welding Cell', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_welding_cell.js', importName: 'createRoboticWeldingCell' },
  { id: 'annealing_lehr_oven', name: 'Lehr Oven', icon: '&#x2699;&#xFE0F;', category: 'annealing', importPath: './machines/annealing_lehr_oven.js', importName: 'createAnnealingLehrOven' },
  { id: 'automated_glassblower_carousel', name: 'Glassblower Carousel', icon: '&#x2699;&#xFE0F;', category: 'automated', importPath: './machines/automated_glassblower_carousel.js', importName: 'createAutomatedGlassblowerCarousel' },
  { id: 'ceramics_glaze_booth', name: 'Glaze Booth', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_glaze_booth.js', importName: 'createGlazeBooth' },
  { id: 'ceramics_isostatic_press', name: 'Isostatic Press', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_isostatic_press.js', importName: 'createIsostaticPress' },
  { id: 'ceramics_pug_mill', name: 'Pug Mill', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_pug_mill.js', importName: 'createPugMill' },
  { id: 'ceramics_slip_casting', name: 'Slip Casting', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_slip_casting.js', importName: 'createSlipCastingTable' },
  { id: 'ceramics_tunnel_kiln', name: 'Tunnel Kiln', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_tunnel_kiln.js', importName: 'createTunnelKiln' },
  { id: 'forestry_feller_buncher', name: 'Feller Buncher', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_feller_buncher.js', importName: 'createFellerBuncher' },
  { id: 'forestry_lidar_drone', name: 'Lidar Drone', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_lidar_drone.js', importName: 'createLidarDrone' },
  { id: 'forestry_log_skimmer', name: 'Log Skimmer', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_log_skimmer.js', importName: 'createLogSkimmer' },
  { id: 'forestry_seed_planter_drone', name: 'Seed Planter Drone', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_seed_planter_drone.js', importName: 'createSeedPlanterDrone' },
  { id: 'forestry_wood_chipper', name: 'Wood Chipper', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_wood_chipper.js', importName: 'createWoodChipper' },
  { id: 'glass_float_line', name: 'Float Line', icon: '&#x2699;&#xFE0F;', category: 'glass_engineering', importPath: './machines/glass_float_line.js', importName: 'createFloatGlassLine' },
  { id: 'metal_basic_oxygen_furnace', name: 'Basic Oxygen Furnace', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_basic_oxygen_furnace.js', importName: 'createBasicOxygenFurnace' },
  { id: 'metal_blast_furnace_taphole', name: 'Blast Furnace Taphole', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_blast_furnace_taphole.js', importName: 'createBlastFurnaceTaphole' },
  { id: 'metal_continuous_casting_machine', name: 'Continuous Casting Machine', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_continuous_casting_machine.js', importName: 'createContinuousCastingMachine' },
  { id: 'metal_hydraulic_forging_hammer', name: 'Hydraulic Forging Hammer', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_hydraulic_forging_hammer.js', importName: 'createHydraulicForgingHammer' },
  { id: 'metal_stamping_press', name: 'Stamping Press', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_stamping_press.js', importName: 'createMetalStampingPress' },
  { id: 'meteorology_automated_weather_station', name: 'Automated Weather Station', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_automated_weather_station.js', importName: 'createAutomatedWeatherStation' },
  { id: 'meteorology_lidar_cloud_ceilometer', name: 'Lidar Cloud Ceilometer', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_lidar_cloud_ceilometer.js', importName: 'createLidarCloudCeilometer' },
  { id: 'meteorology_radiosonde_weather_balloon', name: 'Radiosonde Weather Balloon', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_radiosonde_weather_balloon.js', importName: 'createRadiosondeWeatherBalloon' },
  { id: 'meteorology_sonic_anemometer_array', name: 'Sonic Anemometer Array', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_sonic_anemometer_array.js', importName: 'createSonicAnemometerArray' },
  { id: 'nano_carbon_nanotube_weaver', name: 'Carbon Nanotube Weaver', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_carbon_nanotube_weaver.js', importName: 'createCarbonNanotubeWeaver' },
  { id: 'nano_dip_pen_nanolithography_rig', name: 'Dip Pen Nanolithography Rig', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_dip_pen_nanolithography_rig.js', importName: 'createDipPenNanolithographyRig' },
  { id: 'nano_molecular_assembler', name: 'Molecular Assembler', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_molecular_assembler.js', importName: 'createMolecularAssembler' },
  { id: 'nano_nanoparticle_centrifuge', name: 'Nanoparticle Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_nanoparticle_centrifuge.js', importName: 'createNanoparticleCentrifuge' },
  { id: 'nano_quantum_dot_synthesizer', name: 'Quantum Dot Synthesizer', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_quantum_dot_synthesizer.js', importName: 'createQuantumDotSynthesizer' },
  { id: 'ocean_ctd_rosette', name: 'Ctd Rosette', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_ctd_rosette.js', importName: 'createCTDRosette' },
  { id: 'ocean_seafloor_seismometer', name: 'Seafloor Seismometer', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_seafloor_seismometer.js', importName: 'createSeafloorSeismometer' },
  { id: 'ocean_sonar_array', name: 'Sonar Array', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_sonar_array.js', importName: 'createSonarArray' },
  { id: 'ocean_underwater_glider', name: 'Underwater Glider', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_underwater_glider.js', importName: 'createUnderwaterGlider' },
  { id: 'ocean_wave_buoy', name: 'Wave Buoy', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_wave_buoy.js', importName: 'createWaveBuoy' },
  { id: 'optical_lens_grinder', name: 'Lens Grinder', icon: '&#x2699;&#xFE0F;', category: 'optical', importPath: './machines/optical_lens_grinder.js', importName: 'createOpticalLensGrinder' },
  { id: 'print_3d_bioprinter', name: '3D Bioprinter', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_3d_bioprinter.js', importName: 'createBioprinter' },
  { id: 'print_flexographic_press', name: 'Flexographic Press', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_flexographic_press.js', importName: 'createFlexoPress' },
  { id: 'print_gravure_cylinder', name: 'Gravure Cylinder', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_gravure_cylinder.js', importName: 'createGravureCylinder' },
  { id: 'print_offset_press', name: 'Offset Press', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_offset_press.js', importName: 'createOffsetPress' },
  { id: 'print_screen_printer', name: 'Screen Printer', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_screen_printer.js', importName: 'createScreenPrinter' },
  { id: 'tempered_glass_quenching_chamber', name: 'Glass Quenching Chamber', icon: '&#x2699;&#xFE0F;', category: 'tempered', importPath: './machines/tempered_glass_quenching_chamber.js', importName: 'createTemperedGlassQuenchingChamber' },
  { id: 'textile_dyeing_vat', name: 'Dyeing Vat', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_dyeing_vat.js', importName: 'createDyeingVat' },
  { id: 'textile_fiber_extruder', name: 'Fiber Extruder', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_fiber_extruder.js', importName: 'createFiberExtruder' },
  { id: 'textile_jacquard_loom', name: 'Jacquard Loom', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_jacquard_loom.js', importName: 'createJacquardLoom' },
  { id: 'textile_ring_spinning_frame', name: 'Ring Spinning Frame', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_ring_spinning_frame.js', importName: 'createRingSpinningFrame' },
  { id: 'audio_mixing_console', name: 'Mixing Console', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_mixing_console.js', importName: 'createMixingConsole' },
  { id: 'automated_track_switch', name: 'Track Switch', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/automated_track_switch.js', importName: 'createTrackSwitch' },
  { id: 'dynamic_microphone_capsule', name: 'Microphone Capsule', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/dynamic_microphone_capsule.js', importName: 'createDynamicMicrophone' },
  { id: 'locomotive_bogie_suspension', name: 'Bogie Suspension', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/locomotive_bogie_suspension.js', importName: 'createBogieSuspension' },
  { id: 'maglev_track_guideway', name: 'Track Guideway', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/maglev_track_guideway.js', importName: 'createMaglevGuideway' },
  { id: 'marine_azimuth_thruster', name: 'Azimuth Thruster', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_azimuth_thruster.js', importName: 'createAzimuthThruster' },
  { id: 'marine_ballast_water_system', name: 'Ballast Water System', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_ballast_water_system.js', importName: 'createBallastWaterSystem' },
  { id: 'marine_diesel_crankshaft', name: 'Diesel Crankshaft', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_diesel_crankshaft.js', importName: 'createDieselCrankshaft' },
  { id: 'marine_drydock_gate', name: 'Drydock Gate', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_drydock_gate.js', importName: 'createDrydockGate' },
  { id: 'marine_gyroscopic_stabilizer', name: 'Gyroscopic Stabilizer', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_gyroscopic_stabilizer.js', importName: 'createGyroscopicStabilizer' },
  { id: 'mining_dragline_boom', name: 'Dragline Boom', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_dragline_boom.js', importName: 'createDraglineExcavatorBoom' },
  { id: 'mining_flotation_cell', name: 'Flotation Cell', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_flotation_cell.js', importName: 'createFrothFlotationCell' },
  { id: 'mining_gyratory_crusher', name: 'Gyratory Crusher', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_gyratory_crusher.js', importName: 'createGyratoryRockCrusher' },
  { id: 'nuclear_centrifuge_cascade_rig', name: 'Centrifuge Cascade Rig', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_centrifuge_cascade_rig.js', importName: 'createCentrifugeCascadeRig' },
  { id: 'nuclear_hyperbolic_cooling_tower', name: 'Hyperbolic Cooling Tower', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_hyperbolic_cooling_tower.js', importName: 'createHyperbolicCoolingTower' },
  { id: 'nuclear_pwr_core', name: 'Pwr Core', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_pwr_core.js', importName: 'createPWRCore' },
  { id: 'nuclear_tokamak_chamber', name: 'Tokamak Chamber', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_tokamak_chamber.js', importName: 'createTokamakChamber' },
  { id: 'optics_adaptive_optics_deformable_mirror', name: 'Adaptive Optics Deformable Mirror', icon: '&#x2699;&#xFE0F;', category: 'optics_engineering', importPath: './machines/optics_adaptive_optics_deformable_mirror.js', importName: 'createAdaptiveOpticsDeformableMirror' },
  { id: 'optics_cassegrain_reflector_telescope', name: 'Cassegrain Reflector Telescope', icon: '&#x2699;&#xFE0F;', category: 'optics_engineering', importPath: './machines/optics_cassegrain_reflector_telescope.js', importName: 'createCassegrainReflectorTelescope' },
  { id: 'optics_confocal_laser_scanning_microscope', name: 'Confocal Laser Scanning Microscope', icon: '&#x2699;&#xFE0F;', category: 'optics_engineering', importPath: './machines/optics_confocal_laser_scanning_microscope.js', importName: 'createConfocalLaserScanningMicroscope' },
  { id: 'optics_michelson_laser_interferometer', name: 'Michelson Laser Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optics_engineering', importPath: './machines/optics_michelson_laser_interferometer.js', importName: 'createMichelsonLaserInterferometer' },
  { id: 'optics_optical_fiber_splicer', name: 'Optical Fiber Splicer', icon: '&#x2699;&#xFE0F;', category: 'optics_engineering', importPath: './machines/optics_optical_fiber_splicer.js', importName: 'createOpticalFiberSplicer' },
  { id: 'packaging_blister_packer', name: 'Blister Packer', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_blister_packer.js', importName: 'createBlisterPacker' },
  { id: 'packaging_carton_erector', name: 'Carton Erector', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_carton_erector.js', importName: 'createCartonErector' },
  { id: 'packaging_ffs_machine', name: 'Ffs Machine', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_ffs_machine.js', importName: 'createFFSMachine' },
  { id: 'packaging_robotic_palletizer', name: 'Robotic Palletizer', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_robotic_palletizer.js', importName: 'createRoboticPalletizer' },
  { id: 'packaging_rotary_wrapper', name: 'Rotary Wrapper', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_rotary_wrapper.js', importName: 'createRotaryWrapper' },
  { id: 'petroleum_bop', name: 'Bop', icon: '&#x2699;&#xFE0F;', category: 'petroleum_engineering', importPath: './machines/petroleum_bop.js', importName: 'createSubseaBOP' },
  { id: 'petroleum_derrick', name: 'Derrick', icon: '&#x2699;&#xFE0F;', category: 'petroleum_engineering', importPath: './machines/petroleum_derrick.js', importName: 'createOffshoreDerrick' },
  { id: 'petroleum_pumpjack', name: 'Pumpjack', icon: '&#x2699;&#xFE0F;', category: 'petroleum_engineering', importPath: './machines/petroleum_pumpjack.js', importName: 'createPumpjack' },
  { id: 'petroleum_separator', name: 'Separator', icon: '&#x2699;&#xFE0F;', category: 'petroleum_engineering', importPath: './machines/petroleum_separator.js', importName: 'createThreePhaseSeparator' },
  { id: 'petroleum_tricone_bit', name: 'Tricone Bit', icon: '&#x2699;&#xFE0F;', category: 'petroleum_engineering', importPath: './machines/petroleum_tricone_bit.js', importName: 'createTriconeDrillBit' },
  { id: 'railway_pantograph', name: 'Pantograph', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_pantograph.js', importName: 'createPantograph' },
  { id: 'reel_to_reel_tape_transport', name: 'To Reel Tape Transport', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/reel_to_reel_tape_transport.js', importName: 'createReelToReelTapeTransport' },
  { id: 'ribbon_tweeter_motor', name: 'Tweeter Motor', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/ribbon_tweeter_motor.js', importName: 'createRibbonTweeterMotor' },
  { id: 'sports_golf_swing_robot', name: 'Golf Swing Robot', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_golf_swing_robot.js', importName: 'createGolfSwingRobot' },
  { id: 'sports_helmet_impact_rig', name: 'Helmet Impact Rig', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_helmet_impact_rig.js', importName: 'createHelmetImpactRig' },
  { id: 'sports_instrumented_treadmill', name: 'Instrumented Treadmill', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_instrumented_treadmill.js', importName: 'createInstrumentedTreadmill' },
  { id: 'sports_tennis_ball_cannon', name: 'Tennis Ball Cannon', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_tennis_ball_cannon.js', importName: 'createTennisBallCannon' },
  { id: 'sports_wind_tunnel_bicycle', name: 'Wind Tunnel Bicycle', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_wind_tunnel_bicycle.js', importName: 'createWindTunnelBicycle' },
  { id: 'surveying_airborne_lidar', name: 'Airborne Lidar', icon: '&#x2699;&#xFE0F;', category: 'surveying_engineering', importPath: './machines/surveying_airborne_lidar.js', importName: 'createAirborneLiDAR' },
  { id: 'surveying_digital_theodolite', name: 'Digital Theodolite', icon: '&#x2699;&#xFE0F;', category: 'surveying_engineering', importPath: './machines/surveying_digital_theodolite.js', importName: 'createDigitalTheodolite' },
  { id: 'surveying_gnss_rtk_rover', name: 'Gnss Rtk Rover', icon: '&#x2699;&#xFE0F;', category: 'surveying_engineering', importPath: './machines/surveying_gnss_rtk_rover.js', importName: 'createGNSSRover' },
  { id: 'surveying_robotic_total_station', name: 'Robotic Total Station', icon: '&#x2699;&#xFE0F;', category: 'surveying_engineering', importPath: './machines/surveying_robotic_total_station.js', importName: 'createTotalStation' },
  { id: 'surveying_terrestrial_laser_scanner', name: 'Terrestrial Laser Scanner', icon: '&#x2699;&#xFE0F;', category: 'surveying_engineering', importPath: './machines/surveying_terrestrial_laser_scanner.js', importName: 'createTerrestrialLaserScanner' },
  { id: 'track_tamping_machine', name: 'Tamping Machine', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/track_tamping_machine.js', importName: 'createTrackTampingMachine' },
  { id: 'vinyl_cutting_lathe', name: 'Cutting Lathe', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/vinyl_cutting_lathe.js', importName: 'createVinylCuttingLathe' },
  { id: 'aerospace_ion_thruster', name: 'Ion Thruster', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_ion_thruster.js', importName: 'createIonThruster' },
  { id: 'aerospace_rcs_thruster', name: 'Rcs Thruster', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_rcs_thruster.js', importName: 'createRCSThruster' },
  { id: 'aerospace_solar_array', name: 'Solar Array', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_solar_array.js', importName: 'createSolarArray' },
  { id: 'aerospace_turbofan_bypass', name: 'Turbofan Bypass', icon: '&#x2699;&#xFE0F;', category: 'aerospace', importPath: './machines/aerospace_turbofan_bypass.js', importName: 'createTurbofanBypass' },
  { id: 'auto_catalytic_converter', name: 'Catalytic Converter', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_catalytic_converter.js', importName: 'createCatalyticConverter' },
  { id: 'auto_dual_clutch', name: 'Dual Clutch', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_dual_clutch.js', importName: 'createDualClutch' },
  { id: 'auto_limited_slip_differential', name: 'Limited Slip Differential', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_limited_slip_differential.js', importName: 'createLimitedSlipDifferential' },
  { id: 'auto_rack_pinion', name: 'Rack Pinion', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_rack_pinion.js', importName: 'createRackAndPinion' },
  { id: 'auto_vvt_camshaft', name: 'Vvt Camshaft', icon: '&#x2699;&#xFE0F;', category: 'automotive', importPath: './machines/auto_vvt_camshaft.js', importName: 'createVVTCamshaft' },
  { id: 'chemical_crystallization_tank', name: 'Crystallization Tank', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_crystallization_tank.js', importName: 'createCrystallizationTank' },
  { id: 'chemical_fluidized_bed', name: 'Fluidized Bed', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_fluidized_bed.js', importName: 'createFluidizedBed' },
  { id: 'chemical_reverse_osmosis_array', name: 'Reverse Osmosis Array', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_reverse_osmosis_array.js', importName: 'createReverseOsmosisArray' },
  { id: 'chemical_rotary_kiln', name: 'Rotary Kiln', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_rotary_kiln.js', importName: 'createRotaryKiln' },
  { id: 'chemical_thin_film_evaporator', name: 'Thin Film Evaporator', icon: '&#x2699;&#xFE0F;', category: 'chemical_engineering', importPath: './machines/chemical_thin_film_evaporator.js', importName: 'createThinFilmEvaporator' },
  { id: 'civil_asphalt_paver', name: 'Asphalt Paver', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_asphalt_paver.js', importName: 'createAsphaltPaver' },
  { id: 'civil_pile_driving_rig', name: 'Pile Driving Rig', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_pile_driving_rig.js', importName: 'createPileDrivingRig' },
  { id: 'civil_suspension_anchorage', name: 'Suspension Anchorage', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_suspension_anchorage.js', importName: 'createSuspensionAnchorage' },
  { id: 'civil_tower_crane_jib', name: 'Tower Crane Jib', icon: '&#x2699;&#xFE0F;', category: 'civil', importPath: './machines/civil_tower_crane_jib.js', importName: 'createTowerCraneJib' },
  { id: 'electrical_arc_furnace', name: 'Arc Furnace', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_arc_furnace.js', importName: 'createArcFurnace' },
  { id: 'electrical_insulator_string', name: 'Insulator String', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_insulator_string.js', importName: 'createHighVoltageInsulator' },
  { id: 'electrical_wind_turbine', name: 'Wind Turbine', icon: '&#x2699;&#xFE0F;', category: 'electrical', importPath: './machines/electrical_wind_turbine.js', importName: 'createWindTurbine' },
  { id: 'hardware_gpu_die', name: 'Gpu Die', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_gpu_die.js', importName: 'createGPUDie' },
  { id: 'hardware_liquid_cooling', name: 'Liquid Cooling', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_liquid_cooling.js', importName: 'createLiquidCoolingRadiator' },
  { id: 'hardware_psu_transformer', name: 'Psu Transformer', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_psu_transformer.js', importName: 'createPSUTransformer' },
  { id: 'hardware_ssd_controller', name: 'Ssd Controller', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_ssd_controller.js', importName: 'createSSDController' },
  { id: 'hardware_vrm_phase', name: 'Vrm Phase', icon: '&#x2699;&#xFE0F;', category: 'computer_hardware', importPath: './machines/hardware_vrm_phase.js', importName: 'createVRMPhase' },
  { id: 'materials_electron_microscope', name: 'Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_electron_microscope.js', importName: 'createElectronMicroscopeColumn' },
  { id: 'materials_extrusion_die_block', name: 'Extrusion Die Block', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_extrusion_die_block.js', importName: 'createExtrusionDieBlock' },
  { id: 'materials_injection_molding_platen', name: 'Injection Molding Platen', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_injection_molding_platen.js', importName: 'createInjectionMoldingPlaten' },
  { id: 'materials_wire_drawing_machine', name: 'Wire Drawing Machine', icon: '&#x2699;&#xFE0F;', category: 'materials_science', importPath: './machines/materials_wire_drawing_machine.js', importName: 'createWireDrawingMachine' },
  { id: 'mechanical_planetary_gearbox', name: 'Planetary Gearbox', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_planetary_gearbox.js', importName: 'createPlanetaryGearbox' },
  { id: 'mechanical_scissor_lift', name: 'Scissor Lift', icon: '&#x2699;&#xFE0F;', category: 'mechanical', importPath: './machines/mechanical_scissor_lift.js', importName: 'createScissorLift' },
  { id: 'robotics_auv', name: 'Auv', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_auv.js', importName: 'createAUV' },
  { id: 'robotics_exoskeleton_joint', name: 'Exoskeleton Joint', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_exoskeleton_joint.js', importName: 'createExoskeletonJoint' },
  { id: 'robotics_gripper_claw', name: 'Gripper Claw', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_gripper_claw.js', importName: 'createGripperClaw' },
  { id: 'robotics_omni_wheel', name: 'Omni Wheel', icon: '&#x2699;&#xFE0F;', category: 'robotics', importPath: './machines/robotics_omni_wheel.js', importName: 'createOmniWheelBase' },
  { id: 'ceramics_ball_mill', name: 'Ball Mill', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_ball_mill.js', importName: 'createBallMill' },
  { id: 'ceramics_decal_press', name: 'Decal Press', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_decal_press.js', importName: 'createDecalPress' },
  { id: 'ceramics_extruder', name: 'Extruder', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_extruder.js', importName: 'createCeramicExtruder' },
  { id: 'ceramics_filter_press', name: 'Filter Press', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_filter_press.js', importName: 'createFilterPress' },
  { id: 'ceramics_jiggering_machine', name: 'Jiggering Machine', icon: '&#x2699;&#xFE0F;', category: 'ceramics_engineering', importPath: './machines/ceramics_jiggering_machine.js', importName: 'createJiggeringMachine' },
  { id: 'cnc_glass_cutting_table', name: 'Cnc Glass Cutting Table', icon: '&#x2699;&#xFE0F;', category: 'glass_engineering', importPath: './machines/cnc_glass_cutting_table.js', importName: 'createCNCGlassCuttingTable' },
  { id: 'edge_grinding_machine', name: 'Edge Grinding Machine', icon: '&#x2699;&#xFE0F;', category: 'glass_engineering', importPath: './machines/edge_grinding_machine.js', importName: 'createEdgeGrindingMachine' },
  { id: 'forestry_brush_cutter', name: 'Brush Cutter', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_brush_cutter.js', importName: 'createBrushCutter' },
  { id: 'forestry_forwarder_crane', name: 'Forwarder Crane', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_forwarder_crane.js', importName: 'createForwarderCrane' },
  { id: 'forestry_log_splitter', name: 'Log Splitter', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_log_splitter.js', importName: 'createLogSplitter' },
  { id: 'forestry_stump_grinder', name: 'Stump Grinder', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_stump_grinder.js', importName: 'createStumpGrinder' },
  { id: 'forestry_tree_harvester', name: 'Tree Harvester', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_tree_harvester.js', importName: 'createTreeHarvester' },
  { id: 'glass_lamination_press', name: 'Lamination Press', icon: '&#x2699;&#xFE0F;', category: 'glass_engineering', importPath: './machines/glass_lamination_press.js', importName: 'createGlassLaminationPress' },
  { id: 'glass_tempering_furnace', name: 'Tempering Furnace', icon: '&#x2699;&#xFE0F;', category: 'glass_engineering', importPath: './machines/glass_tempering_furnace.js', importName: 'createGlassTemperingFurnace' },
  { id: 'metal_arc_welding_robot', name: 'Arc Welding Robot', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_arc_welding_robot.js', importName: 'createArcWeldingRobot' },
  { id: 'metal_crucible_melting_furnace', name: 'Crucible Melting Furnace', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_crucible_melting_furnace.js', importName: 'createCrucibleMeltingFurnace' },
  { id: 'metal_drop_forge_press', name: 'Drop Forge Press', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_drop_forge_press.js', importName: 'createDropForgePress' },
  { id: 'metal_hot_rolling_mill', name: 'Hot Rolling Mill', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_hot_rolling_mill.js', importName: 'createHotRollingMillStand' },
  { id: 'metal_induction_heating_coil', name: 'Induction Heating Coil', icon: '&#x2699;&#xFE0F;', category: 'metallurgy', importPath: './machines/metal_induction_heating_coil.js', importName: 'createInductionHeatingCoil' },
  { id: 'meteorology_dropwindsonde_probe', name: 'Dropwindsonde Probe', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_dropwindsonde_probe.js', importName: 'createDropwindsondeProbe' },
  { id: 'meteorology_evaporation_pan_mechanism', name: 'Evaporation Pan Mechanism', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_evaporation_pan_mechanism.js', importName: 'createEvaporationPanMechanism' },
  { id: 'meteorology_sunshine_recorder_glass_sphere', name: 'Sunshine Recorder Glass Sphere', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_sunshine_recorder_glass_sphere.js', importName: 'createSunshineRecorderGlassSphere' },
  { id: 'meteorology_tipping_bucket_rain_gauge', name: 'Tipping Bucket Rain Gauge', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_tipping_bucket_rain_gauge.js', importName: 'createTippingBucketRainGauge' },
  { id: 'meteorology_weather_satellite_antenna', name: 'Weather Satellite Antenna', icon: '&#x2699;&#xFE0F;', category: 'meteorology', importPath: './machines/meteorology_weather_satellite_antenna.js', importName: 'createWeatherSatelliteAntenna' },
  { id: 'nano_afm_cantilever_array', name: 'Afm Cantilever Array', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_afm_cantilever_array.js', importName: 'createAFMCantileverArray' },
  { id: 'nano_focused_ion_beam', name: 'Focused Ion Beam', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_focused_ion_beam.js', importName: 'createFocusedIonBeam' },
  { id: 'nano_molecular_simulation_node', name: 'Molecular Simulation Node', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_molecular_simulation_node.js', importName: 'createMolecularSimulationNode' },
  { id: 'nano_nanoparticle_extruder', name: 'Nanoparticle Extruder', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_nanoparticle_extruder.js', importName: 'createNanoparticleExtruder' },
  { id: 'nano_stm', name: 'Stm', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology', importPath: './machines/nano_stm.js', importName: 'createScanningTunnelingMicroscope' },
  { id: 'ocean_adcp', name: 'Adcp', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_adcp.js', importName: 'createADCP' },
  { id: 'ocean_plankton_net', name: 'Plankton Net', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_plankton_net.js', importName: 'createPlanktonNet' },
  { id: 'ocean_rov_tether', name: 'Rov Tether', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_rov_tether.js', importName: 'createROVTether' },
  { id: 'ocean_sediment_corer', name: 'Sediment Corer', icon: '&#x2699;&#xFE0F;', category: 'oceanography', importPath: './machines/ocean_sediment_corer.js', importName: 'createSedimentCorer' },
  { id: 'print_book_stitcher', name: 'Book Stitcher', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_book_stitcher.js', importName: 'createBookStitcher' },
  { id: 'print_laser_engraver', name: 'Laser Engraver', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_laser_engraver.js', importName: 'createLaserEngraver' },
  { id: 'print_paper_folder', name: 'Paper Folder', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_paper_folder.js', importName: 'createPaperFolder' },
  { id: 'print_toner_fuser', name: 'Toner Fuser', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_toner_fuser.js', importName: 'createTonerFuser' },
  { id: 'print_uv_curing', name: 'Uv Curing', icon: '&#x2699;&#xFE0F;', category: 'printing_technology', importPath: './machines/print_uv_curing.js', importName: 'createUVCuringArray' },
  { id: 'sandblasting_cabinet', name: 'Sandblasting Cabinet', icon: '&#x2699;&#xFE0F;', category: 'glass_engineering', importPath: './machines/sandblasting_cabinet.js', importName: 'createSandblastingCabinet' },
  { id: 'textile_carding_machine', name: 'Carding Machine', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_carding_machine.js', importName: 'createCardingMachine' },
  { id: 'textile_stenter_frame', name: 'Stenter Frame', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_stenter_frame.js', importName: 'createStenterFrame' },
  { id: 'textile_warp_tying', name: 'Warp Tying', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_warp_tying.js', importName: 'createWarpTyingMachine' },
  { id: 'agricultural_combine_rotor', name: 'Combine Rotor', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_combine_rotor.js', importName: 'createCombineHarvesterRotor' },
  { id: 'agricultural_grain_conveyor', name: 'Grain Conveyor', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_grain_conveyor.js', importName: 'createGrainConveyorBelt' },
  { id: 'agricultural_pivot_irrigation', name: 'Pivot Irrigation', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_pivot_irrigation.js', importName: 'createPivotIrrigationSystem' },
  { id: 'agricultural_seed_drill', name: 'Seed Drill', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_seed_drill.js', importName: 'createSeedDrillPlanter' },
  { id: 'agricultural_tractor_pto', name: 'Tractor Pto', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_tractor_pto.js', importName: 'createTractorPTOShaft' },
  { id: 'audio_speaker_coil', name: 'Speaker Coil', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_speaker_coil.js', importName: 'createSpeakerCoil' },
  { id: 'audio_synth_oscillator', name: 'Synth Oscillator', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_synth_oscillator.js', importName: 'createSynthOscillator' },
  { id: 'audio_turntable_tonearm', name: 'Turntable Tonearm', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_turntable_tonearm.js', importName: 'createTurntableTonearm' },
  { id: 'audio_vacuum_tube', name: 'Vacuum Tube', icon: '&#x2699;&#xFE0F;', category: 'audio_engineering', importPath: './machines/audio_vacuum_tube.js', importName: 'createVacuumTube' },
  { id: 'deluge_valve', name: 'Deluge Valve', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/deluge_valve.js', importName: 'createDelugeValve' },
  { id: 'environmental_air_scrubber', name: 'Air Scrubber', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_air_scrubber.js', importName: 'createAirScrubberSystem' },
  { id: 'environmental_bioreactor_tank', name: 'Bioreactor Tank', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_bioreactor_tank.js', importName: 'createBioreactorTank' },
  { id: 'environmental_landfill_gas_flare', name: 'Landfill Gas Flare', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_landfill_gas_flare.js', importName: 'createLandfillGasFlare' },
  { id: 'environmental_ro_filter', name: 'Ro Filter', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_ro_filter.js', importName: 'createReverseOsmosisFilter' },
  { id: 'environmental_sludge_centrifuge', name: 'Sludge Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_sludge_centrifuge.js', importName: 'createSludgeCentrifuge' },
  { id: 'fire_sprinkler_head', name: 'Sprinkler Head', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_sprinkler_head.js', importName: 'createFireSprinklerHead' },
  { id: 'foam_proportioner_system', name: 'Foam Proportioner System', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/foam_proportioner_system.js', importName: 'createFoamProportionerSystem' },
  { id: 'hydrant_valve_mechanism', name: 'Hydrant Valve Mechanism', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/hydrant_valve_mechanism.js', importName: 'createHydrantValveMechanism' },
  { id: 'nuclear_containment_dome_air_lock', name: 'Containment Dome Air Lock', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_containment_dome_air_lock.js', importName: 'createContainmentDomeAirLock' },
  { id: 'nuclear_neutron_detector', name: 'Neutron Detector', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_neutron_detector.js', importName: 'createNeutronDetector' },
  { id: 'nuclear_primary_coolant_pump', name: 'Primary Coolant Pump', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_primary_coolant_pump.js', importName: 'createPrimaryCoolantPump' },
  { id: 'nuclear_spent_fuel_pool_rack', name: 'Spent Fuel Pool Rack', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_spent_fuel_pool_rack.js', importName: 'createSpentFuelPoolRack' },
  { id: 'nuclear_steam_generator_u_tubes', name: 'Steam Generator U Tubes', icon: '&#x2699;&#xFE0F;', category: 'nuclear_engineering', importPath: './machines/nuclear_steam_generator_u_tubes.js', importName: 'createSteamGeneratorUTubes' },
  { id: 'packaging_carton_taper', name: 'Carton Taper', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_carton_taper.js', importName: 'createCartonTaper' },
  { id: 'packaging_rotary_labeler', name: 'Rotary Labeler', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_rotary_labeler.js', importName: 'createRotaryLabeler' },
  { id: 'packaging_shrink_tunnel', name: 'Shrink Tunnel', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_shrink_tunnel.js', importName: 'createShrinkWrapTunnel' },
  { id: 'packaging_thermoforming', name: 'Thermoforming', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_thermoforming.js', importName: 'createThermoformingMachine' },
  { id: 'packaging_vacuum_chamber', name: 'Vacuum Chamber', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_vacuum_chamber.js', importName: 'createVacuumChamber' },
  { id: 'railway_bogie_air_suspension', name: 'Bogie Air Suspension', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_bogie_air_suspension.js', importName: 'createBogieAirSuspension' },
  { id: 'railway_fastening_clip', name: 'Fastening Clip', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_fastening_clip.js', importName: 'createFasteningClip' },
  { id: 'railway_level_crossing', name: 'Level Crossing', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_level_crossing.js', importName: 'createLevelCrossing' },
  { id: 'railway_third_rail_shoe', name: 'Third Rail Shoe', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_third_rail_shoe.js', importName: 'createThirdRailShoe' },
  { id: 'railway_train_coupler', name: 'Train Coupler', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_train_coupler.js', importName: 'createTrainCoupler' },
  { id: 'smoke_detector_chamber', name: 'Smoke Detector Chamber', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/smoke_detector_chamber.js', importName: 'createSmokeDetectorChamber' },
  { id: 'systems_feedback_sensor', name: 'Feedback Sensor', icon: '&#x2699;&#xFE0F;', category: 'systems_engineering', importPath: './machines/systems_feedback_sensor.js', importName: 'createFeedbackSensor' },
  { id: 'systems_mechatronic_board', name: 'Mechatronic Board', icon: '&#x2699;&#xFE0F;', category: 'systems_engineering', importPath: './machines/systems_mechatronic_board.js', importName: 'createMechatronicBoard' },
  { id: 'systems_pid_controller', name: 'Pid Controller', icon: '&#x2699;&#xFE0F;', category: 'systems_engineering', importPath: './machines/systems_pid_controller.js', importName: 'createPIDController' },
  { id: 'systems_redundancy_relay', name: 'Redundancy Relay', icon: '&#x2699;&#xFE0F;', category: 'systems_engineering', importPath: './machines/systems_redundancy_relay.js', importName: 'createRedundancyRelay' },
  { id: 'systems_sorting_conveyor', name: 'Sorting Conveyor', icon: '&#x2699;&#xFE0F;', category: 'systems_engineering', importPath: './machines/systems_sorting_conveyor.js', importName: 'createSortingConveyor' },
  { id: 'telecom_cellular_tower_antenna_array', name: 'Cellular Tower Antenna Array', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_cellular_tower_antenna_array.js', importName: 'createCellTowerAntenna' },
  { id: 'telecom_coaxial_cable_extruder', name: 'Coaxial Cable Extruder', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_coaxial_cable_extruder.js', importName: 'createCoaxialCableExtruder' },
  { id: 'telecom_data_center_rack_switch', name: 'Data Center Rack Switch', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_data_center_rack_switch.js', importName: 'createDataCenterRackSwitch' },
  { id: 'telecom_fiber_optic_splice_enclosure', name: 'Fiber Optic Splice Enclosure', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_fiber_optic_splice_enclosure.js', importName: 'createFiberOpticSpliceEnclosure' },
  { id: 'telecom_microwave_relay_dish', name: 'Microwave Relay Dish', icon: '&#x2699;&#xFE0F;', category: 'telecommunications', importPath: './machines/telecom_microwave_relay_dish.js', importName: 'createMicrowaveRelayDish' },
  { id: 'acoustical_anc_driver', name: 'Anc Driver', icon: '&#x2699;&#xFE0F;', category: 'acoustical_engineering', importPath: './machines/acoustical_anc_driver.js', importName: 'createANCHeadphoneDriver' },
  { id: 'acoustical_anechoic_wedge', name: 'Anechoic Wedge', icon: '&#x2699;&#xFE0F;', category: 'acoustical_engineering', importPath: './machines/acoustical_anechoic_wedge.js', importName: 'createAnechoicWedge' },
  { id: 'acoustical_helmholtz_resonator', name: 'Helmholtz Resonator', icon: '&#x2699;&#xFE0F;', category: 'acoustical_engineering', importPath: './machines/acoustical_helmholtz_resonator.js', importName: 'createHelmholtzResonator' },
  { id: 'acoustical_parametric_speaker', name: 'Parametric Speaker', icon: '&#x2699;&#xFE0F;', category: 'acoustical_engineering', importPath: './machines/acoustical_parametric_speaker.js', importName: 'createParametricArraySpeaker' },
  { id: 'acoustical_spl_microphone', name: 'Spl Microphone', icon: '&#x2699;&#xFE0F;', category: 'acoustical_engineering', importPath: './machines/acoustical_spl_microphone.js', importName: 'createSoundLevelMeterMicrophone' },
  { id: 'computer_memory_stick_dimm', name: 'Memory Stick Dimm', icon: '&#x2699;&#xFE0F;', category: 'computer_engineering', importPath: './machines/computer_memory_stick_dimm.js', importName: 'createMemoryStickDIMM' },
  { id: 'computer_microprocessor_alu', name: 'Microprocessor Alu', icon: '&#x2699;&#xFE0F;', category: 'computer_engineering', importPath: './machines/computer_microprocessor_alu.js', importName: 'createMicroprocessorALU' },
  { id: 'computer_pcie_graphics_card', name: 'Pcie Graphics Card', icon: '&#x2699;&#xFE0F;', category: 'computer_engineering', importPath: './machines/computer_pcie_graphics_card.js', importName: 'createPCIeGraphicsCardCooler' },
  { id: 'computer_quantum_qubit_trap', name: 'Quantum Qubit Trap', icon: '&#x2699;&#xFE0F;', category: 'computer_engineering', importPath: './machines/computer_quantum_qubit_trap.js', importName: 'createQuantumQubitTrap' },
  { id: 'computer_sata_hard_drive', name: 'Sata Hard Drive', icon: '&#x2699;&#xFE0F;', category: 'computer_engineering', importPath: './machines/computer_sata_hard_drive.js', importName: 'createSATAHardDrivePlatterSpin' },
  { id: 'control_centrifugal_governor', name: 'Centrifugal Governor', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_centrifugal_governor.js', importName: 'createCentrifugalGovernor' },
  { id: 'control_gyroscopic_gimbal', name: 'Gyroscopic Gimbal', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_gyroscopic_gimbal.js', importName: 'createGyroscopicGimbal' },
  { id: 'control_gyroscopic_gimbal_stabilizer', name: 'Gyroscopic Gimbal Stabilizer', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_gyroscopic_gimbal_stabilizer.js', importName: 'createGyroscopicGimbalStabilizer' },
  { id: 'control_plc_rack', name: 'Plc Rack', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_plc_rack.js', importName: 'createPLCRack' },
  { id: 'control_pneumatic_valve', name: 'Pneumatic Valve', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_pneumatic_valve.js', importName: 'createPneumaticValvePositioner' },
  { id: 'control_pneumatic_valve_positioner', name: 'Pneumatic Valve Positioner', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_pneumatic_valve_positioner.js', importName: 'createPneumaticValvePositioner' },
  { id: 'control_scada_hmi', name: 'Scada Hmi', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_scada_hmi.js', importName: 'createScadaHmiPanel' },
  { id: 'control_scada_hmi_panel', name: 'Scada Hmi Panel', icon: '&#x2699;&#xFE0F;', category: 'control_engineering', importPath: './machines/control_scada_hmi_panel.js', importName: 'createSCADAHMIPanel' },
  { id: 'geotech_cone_penetrometer', name: 'Cone Penetrometer', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_cone_penetrometer.js', importName: 'createConePenetrometer' },
  { id: 'geotech_inclinometer_casing', name: 'Inclinometer Casing', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_inclinometer_casing.js', importName: 'createInclinometerCasing' },
  { id: 'geotech_penetration_rig', name: 'Penetration Rig', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_penetration_rig.js', importName: 'createPenetrationRig' },
  { id: 'geotech_rock_bolt_expander', name: 'Rock Bolt Expander', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_rock_bolt_expander.js', importName: 'createRockBoltExpander' },
  { id: 'geotech_tbm_shield', name: 'Tbm Shield', icon: '&#x2699;&#xFE0F;', category: 'geotechnical_engineering', importPath: './machines/geotech_tbm_shield.js', importName: 'createTBMShield' },
  { id: 'industrial_agv', name: 'Agv', icon: '&#x2699;&#xFE0F;', category: 'industrial_engineering', importPath: './machines/industrial_agv.js', importName: 'createAGV' },
  { id: 'industrial_ergonomic_lift_assist', name: 'Ergonomic Lift Assist', icon: '&#x2699;&#xFE0F;', category: 'industrial_engineering', importPath: './machines/industrial_ergonomic_lift_assist.js', importName: 'createErgonomicLiftAssist' },
  { id: 'industrial_kanban_sorting_station', name: 'Kanban Sorting Station', icon: '&#x2699;&#xFE0F;', category: 'industrial_engineering', importPath: './machines/industrial_kanban_sorting_station.js', importName: 'createKanbanSortingStation' },
  { id: 'industrial_pick_place_gantry', name: 'Pick Place Gantry', icon: '&#x2699;&#xFE0F;', category: 'industrial_engineering', importPath: './machines/industrial_pick_place_gantry.js', importName: 'createPickAndPlaceGantry' },
  { id: 'industrial_value_stream_conveyor', name: 'Value Stream Conveyor', icon: '&#x2699;&#xFE0F;', category: 'industrial_engineering', importPath: './machines/industrial_value_stream_conveyor.js', importName: 'createValueStreamConveyor' },
  { id: 'manufacturing_5axis_mill', name: '5Axis Mill', icon: '&#x2699;&#xFE0F;', category: 'manufacturing_engineering', importPath: './machines/manufacturing_5axis_mill.js', importName: 'create5AxisMill' },
  { id: 'manufacturing_centerless_grinder', name: 'Centerless Grinder', icon: '&#x2699;&#xFE0F;', category: 'manufacturing_engineering', importPath: './machines/manufacturing_centerless_grinder.js', importName: 'createCenterlessGrinder' },
  { id: 'manufacturing_injection_molder', name: 'Injection Molder', icon: '&#x2699;&#xFE0F;', category: 'manufacturing_engineering', importPath: './machines/manufacturing_injection_molder.js', importName: 'createInjectionStretchBlowMolder' },
  { id: 'manufacturing_laser_sintering', name: 'Laser Sintering', icon: '&#x2699;&#xFE0F;', category: 'manufacturing_engineering', importPath: './machines/manufacturing_laser_sintering.js', importName: 'createLaserSinteringPrinter' },
  { id: 'manufacturing_wire_edm', name: 'Wire Edm', icon: '&#x2699;&#xFE0F;', category: 'manufacturing_engineering', importPath: './machines/manufacturing_wire_edm.js', importName: 'createWireEDM' },
  { id: 'mechatronics_automated_iris', name: 'Automated Iris', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_automated_iris.js', importName: 'createAutomatedIris' },
  { id: 'mechatronics_haptic_joystick', name: 'Haptic Joystick', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_haptic_joystick.js', importName: 'createHapticJoystick' },
  { id: 'mechatronics_self_balancing_robot', name: 'Self Balancing Robot', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_self_balancing_robot.js', importName: 'createSelfBalancingRobot' },
  { id: 'mechatronics_stepper_linear_actuator', name: 'Stepper Linear Actuator', icon: '&#x2699;&#xFE0F;', category: 'mechatronics', importPath: './machines/mechatronics_stepper_linear_actuator.js', importName: 'createStepperLinearActuator' },
  { id: 'structural_post_tensioned_anchorage', name: 'Post Tensioned Anchorage', icon: '&#x2699;&#xFE0F;', category: 'structural_engineering', importPath: './machines/structural_post_tensioned_anchorage.js', importName: 'createPostTensionedAnchorage' },
  { id: 'structural_seismic_base_isolator', name: 'Seismic Base Isolator', icon: '&#x2699;&#xFE0F;', category: 'structural_engineering', importPath: './machines/structural_seismic_base_isolator.js', importName: 'createSeismicBaseIsolator' },
  { id: 'structural_space_frame_node', name: 'Space Frame Node', icon: '&#x2699;&#xFE0F;', category: 'structural_engineering', importPath: './machines/structural_space_frame_node.js', importName: 'createSpaceFrameNode' },
  { id: 'structural_suspension_cable_clamp', name: 'Suspension Cable Clamp', icon: '&#x2699;&#xFE0F;', category: 'structural_engineering', importPath: './machines/structural_suspension_cable_clamp.js', importName: 'createSuspensionCableClamp' },
  { id: 'structural_tuned_mass_damper', name: 'Tuned Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'structural_engineering', importPath: './machines/structural_tuned_mass_damper.js', importName: 'createTunedMassDamper' },
  { id: 'transport_automated_toll_gate', name: 'Automated Toll Gate', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_automated_toll_gate.js', importName: 'createAutomatedTollGate' },
  { id: 'transport_catenary_pantograph', name: 'Catenary Pantograph', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_catenary_pantograph.js', importName: 'createCatenaryPantograph' },
  { id: 'transport_toll_gate', name: 'Toll Gate', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_toll_gate.js', importName: 'createTollGate' },
  { id: 'transport_traffic_signal_box', name: 'Traffic Signal Box', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_traffic_signal_box.js', importName: 'createTrafficSignalBox' },
  { id: 'transport_traffic_signal_controller', name: 'Traffic Signal Controller', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_traffic_signal_controller.js', importName: 'createTrafficSignalController' },
  { id: 'transport_vms_board', name: 'Vms Board', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_vms_board.js', importName: 'createVMSBoard' },
  { id: 'transport_vms_led_board', name: 'Vms Led Board', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_vms_led_board.js', importName: 'createVMSLEDBoard' },
  { id: 'transport_weigh_in_motion', name: 'Weigh In Motion', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_weigh_in_motion.js', importName: 'createWeighInMotion' },
  { id: 'transport_weigh_in_motion_scale', name: 'Weigh In Motion Scale', icon: '&#x2699;&#xFE0F;', category: 'transportation_engineering', importPath: './machines/transport_weigh_in_motion_scale.js', importName: 'createWeighInMotionScale' },
  { id: 'water_archimedes_screw', name: 'Archimedes Screw', icon: '&#x2699;&#xFE0F;', category: 'water_resources_engineering', importPath: './machines/water_archimedes_screw.js', importName: 'createArchimedesScrew' },
  { id: 'water_drip_emitter', name: 'Drip Emitter', icon: '&#x2699;&#xFE0F;', category: 'water_resources_engineering', importPath: './machines/water_drip_emitter.js', importName: 'createDripEmitter' },
  { id: 'water_hydrocyclone', name: 'Hydrocyclone', icon: '&#x2699;&#xFE0F;', category: 'water_resources_engineering', importPath: './machines/water_hydrocyclone.js', importName: 'createHydrocyclone' },
  { id: 'water_kaplan_turbine', name: 'Kaplan Turbine', icon: '&#x2699;&#xFE0F;', category: 'water_resources_engineering', importPath: './machines/water_kaplan_turbine.js', importName: 'createKaplanTurbine' },
  { id: 'water_sluice_gate', name: 'Sluice Gate', icon: '&#x2699;&#xFE0F;', category: 'water_resources_engineering', importPath: './machines/water_sluice_gate.js', importName: 'createSluiceGate' },
  { id: 'agricultural_center_pivot_irrigation_sprinkler', name: 'Center Pivot Irrigation Sprinkler', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_center_pivot_irrigation_sprinkler.js', importName: 'createCenterPivotIrrigationSprinkler' },
  { id: 'agricultural_combine_harvester_reel', name: 'Combine Harvester Reel', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_combine_harvester_reel.js', importName: 'createCombineHarvesterReel' },
  { id: 'agricultural_grain_auger_conveyor', name: 'Grain Auger Conveyor', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_grain_auger_conveyor.js', importName: 'createGrainAugerConveyor' },
  { id: 'agricultural_seed_drill_planter_mechanism', name: 'Seed Drill Planter Mechanism', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_seed_drill_planter_mechanism.js', importName: 'createSeedDrillPlanterMechanism' },
  { id: 'agricultural_tractor_pto_shaft', name: 'Tractor Pto Shaft', icon: '&#x2699;&#xFE0F;', category: 'agricultural_engineering', importPath: './machines/agricultural_tractor_pto_shaft.js', importName: 'createTractorPTOShaft' },
  { id: 'environmental_activated_sludge_aerator', name: 'Activated Sludge Aerator', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_activated_sludge_aerator.js', importName: 'createActivatedSludgeAerator' },
  { id: 'environmental_air_scrubber_tower', name: 'Air Scrubber Tower', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_air_scrubber_tower.js', importName: 'createAirScrubberTower' },
  { id: 'environmental_biofilter_trickling_bed', name: 'Biofilter Trickling Bed', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_biofilter_trickling_bed.js', importName: 'createBiofilterTricklingBed' },
  { id: 'environmental_circular_water_clarifier', name: 'Circular Water Clarifier', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_circular_water_clarifier.js', importName: 'createCircularWaterClarifier' },
  { id: 'environmental_groundwater_monitoring_well_pump', name: 'Groundwater Monitoring Well Pump', icon: '&#x2699;&#xFE0F;', category: 'environmental_engineering', importPath: './machines/environmental_groundwater_monitoring_well_pump.js', importName: 'createGroundwaterMonitoringWellPump' },
  { id: 'fire_protection_deluge_valve', name: 'Protection Deluge Valve', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_protection_deluge_valve.js', importName: 'createDelugeValve' },
  { id: 'fire_protection_dry_pipe_valve', name: 'Protection Dry Pipe Valve', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_protection_dry_pipe_valve.js', importName: 'createDryPipeValve' },
  { id: 'fire_protection_halon_rack', name: 'Protection Halon Rack', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_protection_halon_rack.js', importName: 'createHalonRack' },
  { id: 'fire_protection_pump_impeller', name: 'Protection Pump Impeller', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_protection_pump_impeller.js', importName: 'createPumpImpeller' },
  { id: 'fire_protection_smoke_fan', name: 'Protection Smoke Fan', icon: '&#x2699;&#xFE0F;', category: 'fire_protection_engineering', importPath: './machines/fire_protection_smoke_fan.js', importName: 'createSmokeFan' },
  { id: 'marine_anchor_winch', name: 'Anchor Winch', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_anchor_winch.js', importName: 'createAnchorWinchMechanism' },
  { id: 'marine_ballast_pump', name: 'Ballast Pump', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_ballast_pump.js', importName: 'createSubmarineBallastTankPump' },
  { id: 'marine_bow_thruster', name: 'Bow Thruster', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_bow_thruster.js', importName: 'createShipBowThruster' },
  { id: 'marine_diesel_engine_cylinder', name: 'Diesel Engine Cylinder', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_diesel_engine_cylinder.js', importName: 'createMarineDieselEngineCylinder' },
  { id: 'marine_ship_propeller', name: 'Ship Propeller', icon: '&#x2699;&#xFE0F;', category: 'marine_engineering', importPath: './machines/marine_ship_propeller.js', importName: 'createShipPropellerShaft' },
  { id: 'mining_continuous_miner_cutting_head', name: 'Continuous Miner Cutting Head', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_continuous_miner_cutting_head.js', importName: 'createContinuousMinerCuttingHead' },
  { id: 'mining_froth_flotation_cell', name: 'Froth Flotation Cell', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_froth_flotation_cell.js', importName: 'createFrothFlotationCell' },
  { id: 'mining_mine_hoist_drum', name: 'Mine Hoist Drum', icon: '&#x2699;&#xFE0F;', category: 'mining_engineering', importPath: './machines/mining_mine_hoist_drum.js', importName: 'createMineHoistDrum' },
  { id: 'optical_adaptive_deformable_mirror', name: 'Adaptive Deformable Mirror', icon: '&#x2699;&#xFE0F;', category: 'optical_engineering', importPath: './machines/optical_adaptive_deformable_mirror.js', importName: 'createAdaptiveDeformableMirror' },
  { id: 'optical_fiber_splicer', name: 'Fiber Splicer', icon: '&#x2699;&#xFE0F;', category: 'optical_engineering', importPath: './machines/optical_fiber_splicer.js', importName: 'createFiberSplicer' },
  { id: 'optical_laser_interferometer', name: 'Laser Interferometer', icon: '&#x2699;&#xFE0F;', category: 'optical_engineering', importPath: './machines/optical_laser_interferometer.js', importName: 'createLaserInterferometer' },
  { id: 'optical_spectrometer_prism_array', name: 'Spectrometer Prism Array', icon: '&#x2699;&#xFE0F;', category: 'optical_engineering', importPath: './machines/optical_spectrometer_prism_array.js', importName: 'createSpectrometerPrismArray' },
  { id: 'optical_telescope_equatorial_mount', name: 'Telescope Equatorial Mount', icon: '&#x2699;&#xFE0F;', category: 'optical_engineering', importPath: './machines/optical_telescope_equatorial_mount.js', importName: 'createTelescopeEquatorialMount' },
  { id: 'power_high_voltage_circuit_breaker', name: 'High Voltage Circuit Breaker', icon: '&#x2699;&#xFE0F;', category: 'power_engineering', importPath: './machines/power_high_voltage_circuit_breaker.js', importName: 'createHighVoltageCircuitBreaker' },
  { id: 'power_hydroelectric_pelton_wheel', name: 'Hydroelectric Pelton Wheel', icon: '&#x2699;&#xFE0F;', category: 'power_engineering', importPath: './machines/power_hydroelectric_pelton_wheel.js', importName: 'createHydroelectricPeltonWheel' },
  { id: 'power_steam_turbine_generator', name: 'Steam Turbine Generator', icon: '&#x2699;&#xFE0F;', category: 'power_engineering', importPath: './machines/power_steam_turbine_generator.js', importName: 'createSteamTurbineGenerator' },
  { id: 'power_step_up_transformer', name: 'Step Up Transformer', icon: '&#x2699;&#xFE0F;', category: 'power_engineering', importPath: './machines/power_step_up_transformer.js', importName: 'createStepUpTransformer' },
  { id: 'power_wind_turbine_nacelle', name: 'Wind Turbine Nacelle', icon: '&#x2699;&#xFE0F;', category: 'power_engineering', importPath: './machines/power_wind_turbine_nacelle.js', importName: 'createWindTurbineNacelle' },
  { id: 'reliability_drop_tester', name: 'Drop Tester', icon: '&#x2699;&#xFE0F;', category: 'reliability_engineering', importPath: './machines/reliability_drop_tester.js', importName: 'createDropTestRig' },
  { id: 'reliability_fatigue_tester', name: 'Fatigue Tester', icon: '&#x2699;&#xFE0F;', category: 'reliability_engineering', importPath: './machines/reliability_fatigue_tester.js', importName: 'createFatigueTestingMachine' },
  { id: 'reliability_salt_spray', name: 'Salt Spray', icon: '&#x2699;&#xFE0F;', category: 'reliability_engineering', importPath: './machines/reliability_salt_spray.js', importName: 'createSaltSprayCorrosionTester' },
  { id: 'reliability_thermal_chamber', name: 'Thermal Chamber', icon: '&#x2699;&#xFE0F;', category: 'reliability_engineering', importPath: './machines/reliability_thermal_chamber.js', importName: 'createThermalCyclingChamber' },
  { id: 'reliability_vibration_shaker', name: 'Vibration Shaker', icon: '&#x2699;&#xFE0F;', category: 'reliability_engineering', importPath: './machines/reliability_vibration_shaker.js', importName: 'createElectrodynamicVibrationShaker' },
  { id: 'robotics_bipedal_walker', name: 'Bipedal Walker', icon: '&#x2699;&#xFE0F;', category: 'robotics_engineering', importPath: './machines/robotics_bipedal_walker.js', importName: 'createBipedalWalker' },
  { id: 'robotics_delta_picker', name: 'Delta Picker', icon: '&#x2699;&#xFE0F;', category: 'robotics_engineering', importPath: './machines/robotics_delta_picker.js', importName: 'createDeltaPicker' },
  { id: 'robotics_gripper', name: 'Gripper', icon: '&#x2699;&#xFE0F;', category: 'robotics_engineering', importPath: './machines/robotics_gripper.js', importName: 'createRoboticGripper' },
  { id: 'robotics_mecanum_base', name: 'Mecanum Base', icon: '&#x2699;&#xFE0F;', category: 'robotics_engineering', importPath: './machines/robotics_mecanum_base.js', importName: 'createMecanumBase' },
  { id: 'textile_carding_machine_cylinder', name: 'Carding Machine Cylinder', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_carding_machine_cylinder.js', importName: 'createCardingMachineCylinder' },
  { id: 'textile_industrial_power_loom', name: 'Industrial Power Loom', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_industrial_power_loom.js', importName: 'createIndustrialPowerLoom' },
  { id: 'textile_jacquard_card_reader', name: 'Jacquard Card Reader', icon: '&#x2699;&#xFE0F;', category: 'textile_engineering', importPath: './machines/textile_jacquard_card_reader.js', importName: 'createJacquardCardReaderMechanism' },
  { id: 'fluid_power_axial_piston_pump', name: 'Power Axial Piston Pump', icon: '&#x2699;&#xFE0F;', category: 'fluid_power_engineering', importPath: './machines/fluid_power_axial_piston_pump.js', importName: 'createAxialPistonPump' },
  { id: 'fluid_power_hydraulic_bladder_accumulator', name: 'Power Hydraulic Bladder Accumulator', icon: '&#x2699;&#xFE0F;', category: 'fluid_power_engineering', importPath: './machines/fluid_power_hydraulic_bladder_accumulator.js', importName: 'createHydraulicBladderAccumulator' },
  { id: 'fluid_power_hydraulic_double_acting_cylinder', name: 'Power Hydraulic Double Acting Cylinder', icon: '&#x2699;&#xFE0F;', category: 'fluid_power_engineering', importPath: './machines/fluid_power_hydraulic_double_acting_cylinder.js', importName: 'createHydraulicDoubleActingCylinder' },
  { id: 'fluid_power_pneumatic_frl', name: 'Power Pneumatic Frl', icon: '&#x2699;&#xFE0F;', category: 'fluid_power_engineering', importPath: './machines/fluid_power_pneumatic_frl.js', importName: 'createPneumaticFRL' },
  { id: 'fluid_power_proportional_directional_control_valve', name: 'Power Proportional Directional Control Valve', icon: '&#x2699;&#xFE0F;', category: 'fluid_power_engineering', importPath: './machines/fluid_power_proportional_directional_control_valve.js', importName: 'createProportionalDirectionalControlValve' },
  { id: 'hvac_ahu', name: 'Ahu', icon: '&#x2699;&#xFE0F;', category: 'hvac_engineering', importPath: './machines/hvac_ahu.js', importName: 'createAirHandlingUnit' },
  { id: 'hvac_chiller_unit', name: 'Chiller Unit', icon: '&#x2699;&#xFE0F;', category: 'hvac_engineering', importPath: './machines/hvac_chiller_unit.js', importName: 'createChillerUnit' },
  { id: 'hvac_enthalpy_wheel', name: 'Enthalpy Wheel', icon: '&#x2699;&#xFE0F;', category: 'hvac_engineering', importPath: './machines/hvac_enthalpy_wheel.js', importName: 'createRotaryHeatExchanger' },
  { id: 'hvac_vav_box', name: 'Vav Box', icon: '&#x2699;&#xFE0F;', category: 'hvac_engineering', importPath: './machines/hvac_vav_box.js', importName: 'createVAVBox' },
  { id: 'packaging_blister_machine', name: 'Blister Machine', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_blister_machine.js', importName: 'createBlisterPackagingMachine' },
  { id: 'packaging_checkweigher_conveyor', name: 'Checkweigher Conveyor', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_checkweigher_conveyor.js', importName: 'createCheckweigherConveyor' },
  { id: 'packaging_liquid_filling_nozzle', name: 'Liquid Filling Nozzle', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_liquid_filling_nozzle.js', importName: 'createLiquidFillingNozzleArray' },
  { id: 'packaging_strapping_tensioner', name: 'Strapping Tensioner', icon: '&#x2699;&#xFE0F;', category: 'packaging_engineering', importPath: './machines/packaging_strapping_tensioner.js', importName: 'createStrappingMachineTensioner' },
  { id: 'plastics_blown_film', name: 'Blown Film', icon: '&#x2699;&#xFE0F;', category: 'plastics_engineering', importPath: './machines/plastics_blown_film.js', importName: 'createBlownFilmExtrusionTower' },
  { id: 'plastics_injection_molder', name: 'Injection Molder', icon: '&#x2699;&#xFE0F;', category: 'plastics_engineering', importPath: './machines/plastics_injection_molder.js', importName: 'createInjectionMoldingMachine' },
  { id: 'plastics_pelletizing_extruder', name: 'Pelletizing Extruder', icon: '&#x2699;&#xFE0F;', category: 'plastics_engineering', importPath: './machines/plastics_pelletizing_extruder.js', importName: 'createPelletizingExtruderDie' },
  { id: 'plastics_rotational_molding', name: 'Rotational Molding', icon: '&#x2699;&#xFE0F;', category: 'plastics_engineering', importPath: './machines/plastics_rotational_molding.js', importName: 'createRotationalMoldingArm' },
  { id: 'plastics_thermoforming', name: 'Thermoforming', icon: '&#x2699;&#xFE0F;', category: 'plastics_engineering', importPath: './machines/plastics_thermoforming.js', importName: 'createThermoformingPlaten' },
  { id: 'process_cstr', name: 'Cstr', icon: '&#x2699;&#xFE0F;', category: 'process_engineering', importPath: './machines/process_cstr.js', importName: 'createCSTR' },
  { id: 'process_distillation_column', name: 'Distillation Column', icon: '&#x2699;&#xFE0F;', category: 'process_engineering', importPath: './machines/process_distillation_column.js', importName: 'createFractionalDistillationColumn' },
  { id: 'process_flare_gas_recovery', name: 'Flare Gas Recovery', icon: '&#x2699;&#xFE0F;', category: 'process_engineering', importPath: './machines/process_flare_gas_recovery.js', importName: 'createFlareGasRecoverySystem' },
  { id: 'process_heat_exchanger', name: 'Heat Exchanger', icon: '&#x2699;&#xFE0F;', category: 'process_engineering', importPath: './machines/process_heat_exchanger.js', importName: 'createShellAndTubeHeatExchanger' },
  { id: 'process_rotary_dryer', name: 'Rotary Dryer', icon: '&#x2699;&#xFE0F;', category: 'process_engineering', importPath: './machines/process_rotary_dryer.js', importName: 'createRotaryDryer' },
  { id: 'quality_cmm', name: 'Cmm', icon: '&#x2699;&#xFE0F;', category: 'quality_engineering', importPath: './machines/quality_cmm.js', importName: 'createCMM' },
  { id: 'quality_optical_comparator', name: 'Optical Comparator', icon: '&#x2699;&#xFE0F;', category: 'quality_engineering', importPath: './machines/quality_optical_comparator.js', importName: 'createOpticalComparator' },
  { id: 'quality_roughness_tester', name: 'Roughness Tester', icon: '&#x2699;&#xFE0F;', category: 'quality_engineering', importPath: './machines/quality_roughness_tester.js', importName: 'createRoughnessTester' },
  { id: 'quality_shore_durometer', name: 'Shore Durometer', icon: '&#x2699;&#xFE0F;', category: 'quality_engineering', importPath: './machines/quality_shore_durometer.js', importName: 'createShoreDurometer' },
  { id: 'quality_ultrasonic_scanner', name: 'Ultrasonic Scanner', icon: '&#x2699;&#xFE0F;', category: 'quality_engineering', importPath: './machines/quality_ultrasonic_scanner.js', importName: 'createUltrasonicScanner' },
  { id: 'sound_analog_mixing_console', name: 'Analog Mixing Console', icon: '&#x2699;&#xFE0F;', category: 'sound_engineering', importPath: './machines/sound_analog_mixing_console.js', importName: 'createAnalogMixingConsole' },
  { id: 'sound_audio_limiter_compressor_tube', name: 'Audio Limiter Compressor Tube', icon: '&#x2699;&#xFE0F;', category: 'sound_engineering', importPath: './machines/sound_audio_limiter_compressor_tube.js', importName: 'createAudioLimiterCompressorTube' },
  { id: 'sound_ribbon_microphone_capsule', name: 'Ribbon Microphone Capsule', icon: '&#x2699;&#xFE0F;', category: 'sound_engineering', importPath: './machines/sound_ribbon_microphone_capsule.js', importName: 'createRibbonMicrophoneCapsule' },
  { id: 'sound_spring_reverb_tank', name: 'Spring Reverb Tank', icon: '&#x2699;&#xFE0F;', category: 'sound_engineering', importPath: './machines/sound_spring_reverb_tank.js', importName: 'createSpringReverbTank' },
  { id: 'sound_studio_monitor_crossover', name: 'Studio Monitor Crossover', icon: '&#x2699;&#xFE0F;', category: 'sound_engineering', importPath: './machines/sound_studio_monitor_crossover.js', importName: 'createStudioMonitorCrossover' },
  { id: 'systems_core_router', name: 'Core Router', icon: '&#x2699;&#xFE0F;', category: 'systems_architecture', importPath: './machines/systems_core_router.js', importName: 'createCoreRouter' },
  { id: 'systems_crac_unit', name: 'Crac Unit', icon: '&#x2699;&#xFE0F;', category: 'systems_architecture', importPath: './machines/systems_crac_unit.js', importName: 'createCRACUnit' },
  { id: 'systems_data_center_rack', name: 'Data Center Rack', icon: '&#x2699;&#xFE0F;', category: 'systems_architecture', importPath: './machines/systems_data_center_rack.js', importName: 'createDataCenterRack' },
  { id: 'systems_fiber_patch_panel', name: 'Fiber Patch Panel', icon: '&#x2699;&#xFE0F;', category: 'systems_architecture', importPath: './machines/systems_fiber_patch_panel.js', importName: 'createFiberPatchPanel' },
  { id: 'systems_ups_bank', name: 'Ups Bank', icon: '&#x2699;&#xFE0F;', category: 'systems_architecture', importPath: './machines/systems_ups_bank.js', importName: 'createUPSBank' },
  { id: 'traffic_automated_toll_booth_boom', name: 'Automated Toll Booth Boom', icon: '&#x2699;&#xFE0F;', category: 'traffic_engineering', importPath: './machines/traffic_automated_toll_booth_boom.js', importName: 'createAutomatedTollBoothBoom' },
  { id: 'traffic_inductive_loop_detector', name: 'Inductive Loop Detector', icon: '&#x2699;&#xFE0F;', category: 'traffic_engineering', importPath: './machines/traffic_inductive_loop_detector.js', importName: 'createInductiveLoopDetector' },
  { id: 'traffic_radar_speed_camera', name: 'Radar Speed Camera', icon: '&#x2699;&#xFE0F;', category: 'traffic_engineering', importPath: './machines/traffic_radar_speed_camera.js', importName: 'createRadarSpeedCamera' },
  { id: 'traffic_signal_controller_cabinet', name: 'Signal Controller Cabinet', icon: '&#x2699;&#xFE0F;', category: 'traffic_engineering', importPath: './machines/traffic_signal_controller_cabinet.js', importName: 'createTrafficSignalControllerCabinet' },
  { id: 'traffic_variable_message_sign', name: 'Variable Message Sign', icon: '&#x2699;&#xFE0F;', category: 'traffic_engineering', importPath: './machines/traffic_variable_message_sign.js', importName: 'createVariableMessageSign' },
  { id: 'welding_friction_stir_spindle', name: 'Friction Stir Spindle', icon: '&#x2699;&#xFE0F;', category: 'welding_engineering', importPath: './machines/welding_friction_stir_spindle.js', importName: 'createFrictionStirSpindle' },
  { id: 'welding_plasma_torch', name: 'Plasma Torch', icon: '&#x2699;&#xFE0F;', category: 'welding_engineering', importPath: './machines/welding_plasma_torch.js', importName: 'createPlasmaTorch' },
  { id: 'welding_spot_clamp', name: 'Spot Clamp', icon: '&#x2699;&#xFE0F;', category: 'welding_engineering', importPath: './machines/welding_spot_clamp.js', importName: 'createSpotWeldingClamp' },
  { id: 'welding_submerged_arc_tractor', name: 'Submerged Arc Tractor', icon: '&#x2699;&#xFE0F;', category: 'welding_engineering', importPath: './machines/welding_submerged_arc_tractor.js', importName: 'createSubmergedArcTractor' },
  { id: 'welding_tig_torch', name: 'Tig Torch', icon: '&#x2699;&#xFE0F;', category: 'welding_engineering', importPath: './machines/welding_tig_torch.js', importName: 'createTigWeldingTorch' },
  { id: 'cryptography_enigma_rotor', name: 'Enigma Rotor', icon: '&#x2699;&#xFE0F;', category: 'cryptography_engineering', importPath: './machines/cryptography_enigma_rotor.js', importName: 'createEnigmaRotor' },
  { id: 'cryptography_hsm', name: 'Hsm', icon: '&#x2699;&#xFE0F;', category: 'cryptography_engineering', importPath: './machines/cryptography_hsm.js', importName: 'createHardwareSecurityModule' },
  { id: 'cryptography_lorenz_wheel', name: 'Lorenz Wheel', icon: '&#x2699;&#xFE0F;', category: 'cryptography_engineering', importPath: './machines/cryptography_lorenz_wheel.js', importName: 'createLorenzCipherWheel' },
  { id: 'cryptography_qkd_node', name: 'Qkd Node', icon: '&#x2699;&#xFE0F;', category: 'cryptography_engineering', importPath: './machines/cryptography_qkd_node.js', importName: 'createQuantumKeyDistributionNode' },
  { id: 'cryptography_smart_card_chip', name: 'Smart Card Chip', icon: '&#x2699;&#xFE0F;', category: 'cryptography_engineering', importPath: './machines/cryptography_smart_card_chip.js', importName: 'createCryptographicSmartCardChip' },
  { id: 'embedded_brushless_esc', name: 'Brushless Esc', icon: '&#x2699;&#xFE0F;', category: 'embedded_systems_engineering', importPath: './machines/embedded_brushless_esc.js', importName: 'createBrushlessMotorESC' },
  { id: 'embedded_can_bus_transceiver', name: 'Can Bus Transceiver', icon: '&#x2699;&#xFE0F;', category: 'embedded_systems_engineering', importPath: './machines/embedded_can_bus_transceiver.js', importName: 'createCANBusTransceiver' },
  { id: 'embedded_i2c_sensor', name: 'I2c Sensor', icon: '&#x2699;&#xFE0F;', category: 'embedded_systems_engineering', importPath: './machines/embedded_i2c_sensor.js', importName: 'createI2CSensorBreakout' },
  { id: 'embedded_jtag_debugger', name: 'Jtag Debugger', icon: '&#x2699;&#xFE0F;', category: 'embedded_systems_engineering', importPath: './machines/embedded_jtag_debugger.js', importName: 'createJTAGDebuggerProbe' },
  { id: 'embedded_microcontroller_board', name: 'Microcontroller Board', icon: '&#x2699;&#xFE0F;', category: 'embedded_systems_engineering', importPath: './machines/embedded_microcontroller_board.js', importName: 'createMicrocontrollerBoard' },
  { id: 'forestry_feller_buncher_head', name: 'Feller Buncher Head', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_feller_buncher_head.js', importName: 'createFellerBuncherHead' },
  { id: 'forestry_log_skidder_grapple', name: 'Log Skidder Grapple', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_log_skidder_grapple.js', importName: 'createLogSkidderGrapple' },
  { id: 'forestry_mulcher_drum', name: 'Mulcher Drum', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_mulcher_drum.js', importName: 'createForestryMulcherDrum' },
  { id: 'forestry_portable_sawmill', name: 'Portable Sawmill', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_portable_sawmill.js', importName: 'createPortableSawmillBandsaw' },
  { id: 'forestry_portable_sawmill_bandsaw', name: 'Portable Sawmill Bandsaw', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_portable_sawmill_bandsaw.js', importName: 'createPortableSawmillBandsaw' },
  { id: 'forestry_stump_grinder_wheel', name: 'Stump Grinder Wheel', icon: '&#x2699;&#xFE0F;', category: 'forestry_engineering', importPath: './machines/forestry_stump_grinder_wheel.js', importName: 'createStumpGrinderWheel' },
  { id: 'nanotechnology_afm', name: 'Afm', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology_engineering', importPath: './machines/nanotechnology_afm.js', importName: 'createAtomicForceMicroscope' },
  { id: 'nanotechnology_cnt_actuator', name: 'Cnt Actuator', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology_engineering', importPath: './machines/nanotechnology_cnt_actuator.js', importName: 'createCarbonNanotubeActuator' },
  { id: 'nanotechnology_dna_motor', name: 'Dna Motor', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology_engineering', importPath: './machines/nanotechnology_dna_motor.js', importName: 'createDNAOrigamiMotor' },
  { id: 'nanotechnology_drug_delivery', name: 'Drug Delivery', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology_engineering', importPath: './machines/nanotechnology_drug_delivery.js', importName: 'createNanoparticleDrugDeliveryVehicle' },
  { id: 'nanotechnology_molecular_gears', name: 'Molecular Gears', icon: '&#x2699;&#xFE0F;', category: 'nanotechnology_engineering', importPath: './machines/nanotechnology_molecular_gears.js', importName: 'createMolecularGears' },
  { id: 'paper_calender_rolls', name: 'Calender Rolls', icon: '&#x2699;&#xFE0F;', category: 'paper_engineering', importPath: './machines/paper_calender_rolls.js', importName: 'createPaperCalenderRolls' },
  { id: 'paper_fourdrinier_wire', name: 'Fourdrinier Wire', icon: '&#x2699;&#xFE0F;', category: 'paper_engineering', importPath: './machines/paper_fourdrinier_wire.js', importName: 'createFourdrinierWire' },
  { id: 'paper_pulp_digester', name: 'Pulp Digester', icon: '&#x2699;&#xFE0F;', category: 'paper_engineering', importPath: './machines/paper_pulp_digester.js', importName: 'createPulpDigesterTank' },
  { id: 'paper_slitter_rewinder', name: 'Slitter Rewinder', icon: '&#x2699;&#xFE0F;', category: 'paper_engineering', importPath: './machines/paper_slitter_rewinder.js', importName: 'createSlitterRewinderKnife' },
  { id: 'paper_yankee_dryer', name: 'Yankee Dryer', icon: '&#x2699;&#xFE0F;', category: 'paper_engineering', importPath: './machines/paper_yankee_dryer.js', importName: 'createYankeeDryerCylinder' },
  { id: 'photonics_laser_diode', name: 'Laser Diode', icon: '&#x2699;&#xFE0F;', category: 'photonics_engineering', importPath: './machines/photonics_laser_diode.js', importName: 'createLaserDiode' },
  { id: 'photonics_mach_zehnder', name: 'Mach Zehnder', icon: '&#x2699;&#xFE0F;', category: 'photonics_engineering', importPath: './machines/photonics_mach_zehnder.js', importName: 'createMachZehnderInterferometer' },
  { id: 'photonics_optical_parametric_oscillator', name: 'Optical Parametric Oscillator', icon: '&#x2699;&#xFE0F;', category: 'photonics_engineering', importPath: './machines/photonics_optical_parametric_oscillator.js', importName: 'createOpticalParametricOscillator' },
  { id: 'photonics_photomultiplier_tube', name: 'Photomultiplier Tube', icon: '&#x2699;&#xFE0F;', category: 'photonics_engineering', importPath: './machines/photonics_photomultiplier_tube.js', importName: 'createPhotomultiplierTube' },
  { id: 'photonics_ring_resonator', name: 'Ring Resonator', icon: '&#x2699;&#xFE0F;', category: 'photonics_engineering', importPath: './machines/photonics_ring_resonator.js', importName: 'createRingResonator' },
  { id: 'railway_air_brake_cylinder', name: 'Air Brake Cylinder', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_air_brake_cylinder.js', importName: 'createTrainAirBrakeCylinder' },
  { id: 'railway_bogie_suspension', name: 'Bogie Suspension', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_bogie_suspension.js', importName: 'createBogieSuspensionSystem' },
  { id: 'railway_switching_point', name: 'Switching Point', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_switching_point.js', importName: 'createRailwaySwitchingPoint' },
  { id: 'railway_track_tamping_head', name: 'Track Tamping Head', icon: '&#x2699;&#xFE0F;', category: 'railway_engineering', importPath: './machines/railway_track_tamping_head.js', importName: 'createTrackTampingMachineHead' },
  { id: 'sports_automated_pinsetter', name: 'Automated Pinsetter', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_automated_pinsetter.js', importName: 'createAutomatedBowlingPinsetter' },
  { id: 'sports_cycling_power_meter', name: 'Cycling Power Meter', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_cycling_power_meter.js', importName: 'createCyclingPowerMeterCrank' },
  { id: 'sports_golf_swing_sensor', name: 'Golf Swing Sensor', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_golf_swing_sensor.js', importName: 'createGolfSwingBiomechanicsSensor' },
  { id: 'sports_rowing_ergometer', name: 'Rowing Ergometer', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_rowing_ergometer.js', importName: 'createRowingMachineErgometer' },
  { id: 'sports_tennis_ball_machine', name: 'Tennis Ball Machine', icon: '&#x2699;&#xFE0F;', category: 'sports_engineering', importPath: './machines/sports_tennis_ball_machine.js', importName: 'createTennisBallMachine' },
  { id: 'telecom_cell_tower_antenna', name: 'Cell Tower Antenna', icon: '&#x2699;&#xFE0F;', category: 'telecommunications_engineering', importPath: './machines/telecom_cell_tower_antenna.js', importName: 'createCellTowerAntenna' },
  { id: 'telecom_fiber_transceiver', name: 'Fiber Transceiver', icon: '&#x2699;&#xFE0F;', category: 'telecommunications_engineering', importPath: './machines/telecom_fiber_transceiver.js', importName: 'createFiberOpticTransceiverModule' },
  { id: 'telecom_parabolic_dish', name: 'Parabolic Dish', icon: '&#x2699;&#xFE0F;', category: 'telecommunications_engineering', importPath: './machines/telecom_parabolic_dish.js', importName: 'createParabolicMicrowaveDish' },
  { id: 'telecom_satellite_dish', name: 'Satellite Dish', icon: '&#x2699;&#xFE0F;', category: 'telecommunications_engineering', importPath: './machines/telecom_satellite_dish.js', importName: 'createSatelliteCommunicationDish' },
  { id: 'telecom_undersea_repeater', name: 'Undersea Repeater', icon: '&#x2699;&#xFE0F;', category: 'telecommunications_engineering', importPath: './machines/telecom_undersea_repeater.js', importName: 'createUnderseaCableRepeater' },

  { id: 'ammonite_shell', name: 'Ammonite Shell', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ammonite_shell.js', importName: 'createAmmoniteShell' },
  { id: 'bioeng_artificial_heart', name: 'Bioeng Artificial Heart', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_artificial_heart.js', importName: 'createArtificialHeart' },
  { id: 'bioeng_bioprinting_extruder', name: 'Bioeng Bioprinting Extruder', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_bioprinting_extruder.js', importName: 'createBioprintingExtruder' },
  { id: 'bioeng_bioreactor', name: 'Bioeng Bioreactor', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_bioreactor.js', importName: 'createBioreactor' },
  { id: 'bioeng_dialysis_membrane', name: 'Bioeng Dialysis Membrane', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_dialysis_membrane.js', importName: 'createDialysisMembrane' },
  { id: 'bioeng_dna_sequencer', name: 'Bioeng Dna Sequencer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_dna_sequencer.js', importName: 'createDnaSequencer' },
  { id: 'bioeng_microfluidic_chip', name: 'Bioeng Microfluidic Chip', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_microfluidic_chip.js', importName: 'createMicrofluidicChip' },
  { id: 'bioeng_mri_coil', name: 'Bioeng Mri Coil', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_mri_coil.js', importName: 'createMriCoil' },
  { id: 'bioeng_peristaltic_pump', name: 'Bioeng Peristaltic Pump', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_peristaltic_pump.js', importName: 'createPeristalticPump' },
  { id: 'bioeng_prosthetic_knee', name: 'Bioeng Prosthetic Knee', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_prosthetic_knee.js', importName: 'createProstheticKnee' },
  { id: 'bioeng_ventilator_bellows', name: 'Bioeng Ventilator Bellows', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioeng_ventilator_bellows.js', importName: 'createVentilatorBellows' },
  { id: 'bioinformatics_cell_division', name: 'Bioinformatics Cell Division', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinformatics_cell_division.js', importName: 'createCellDivision' },
  { id: 'bioinformatics_dna_helix', name: 'Bioinformatics Dna Helix', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinformatics_dna_helix.js', importName: 'createDNAHelix' },
  { id: 'bioinformatics_protein_folder', name: 'Bioinformatics Protein Folder', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinformatics_protein_folder.js', importName: 'createProteinFolder' },
  { id: 'bioinformatics_ribosome_translator', name: 'Bioinformatics Ribosome Translator', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinformatics_ribosome_translator.js', importName: 'createRibosomeTranslator' },
  { id: 'bioinformatics_viral_capsid', name: 'Bioinformatics Viral Capsid', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinformatics_viral_capsid.js', importName: 'createViralCapsid' },
  { id: 'bioinfo_cryo_em_processor', name: 'Bioinfo Cryo Em Processor', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinfo_cryo_em_processor.js', importName: 'createCryoEMProcessor' },
  { id: 'bioinfo_dna_sequencer', name: 'Bioinfo Dna Sequencer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinfo_dna_sequencer.js', importName: 'createDNASequencer' },
  { id: 'bioinfo_microarray_scanner', name: 'Bioinfo Microarray Scanner', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinfo_microarray_scanner.js', importName: 'createMicroarrayScanner' },
  { id: 'bioinfo_protein_folder', name: 'Bioinfo Protein Folder', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinfo_protein_folder.js', importName: 'createProteinFolder' },
  { id: 'bioinfo_server_cluster', name: 'Bioinfo Server Cluster', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioinfo_server_cluster.js', importName: 'createServerCluster' },
  { id: 'biology_adenovirus', name: 'Biology Adenovirus', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_adenovirus.js', importName: 'createAdenovirusCapsid' },
  { id: 'biology_alveoli_gas_exchange', name: 'Biology Alveoli Gas Exchange', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_alveoli_gas_exchange.js', importName: 'createAlveoli' },
  { id: 'biology_amygdala', name: 'Biology Amygdala', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_amygdala.js', importName: 'createAmygdala' },
  { id: 'biology_ant_mandibles', name: 'Biology Ant Mandibles', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_ant_mandibles.js', importName: 'createAntMandibles' },
  { id: 'biology_aortic_arch', name: 'Biology Aortic Arch', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_aortic_arch.js', importName: 'createAorticArch' },
  { id: 'biology_bcell', name: 'Biology Bcell', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_bcell.js', importName: 'createBCell' },
  { id: 'biology_bee_stinger', name: 'Biology Bee Stinger', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_bee_stinger.js', importName: 'createHoneybeeStinger' },
  { id: 'biology_bioluminescent_chromatophore', name: 'Biology Bioluminescent Chromatophore', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_bioluminescent_chromatophore.js', importName: 'createBioluminescentChromatophore' },
  { id: 'biology_bronchial_tree_branching', name: 'Biology Bronchial Tree Branching', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_bronchial_tree_branching.js', importName: 'createBronchialTree' },
  { id: 'biology_butterfly_proboscis', name: 'Biology Butterfly Proboscis', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_butterfly_proboscis.js', importName: 'createButterflyProboscis' },
  { id: 'biology_capillary_bed', name: 'Biology Capillary Bed', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_capillary_bed.js', importName: 'createCapillaryBed' },
  { id: 'biology_cerebellum_purkinje', name: 'Biology Cerebellum Purkinje', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_cerebellum_purkinje.js', importName: 'createCerebellumPurkinje' },
  { id: 'biology_cerebral_cortex', name: 'Biology Cerebral Cortex', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_cerebral_cortex.js', importName: 'createCerebralCortex' },
  { id: 'biology_complement', name: 'Biology Complement', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_complement.js', importName: 'createComplementSystem' },
  { id: 'biology_coral_polyp', name: 'Biology Coral Polyp', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_coral_polyp.js', importName: 'createCoralPolyp' },
  { id: 'biology_cytoskeleton_network', name: 'Biology Cytoskeleton Network', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_cytoskeleton_network.js', importName: 'createCytoskeletonNetwork' },
  { id: 'biology_dendritic', name: 'Biology Dendritic', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_dendritic.js', importName: 'createDendriticCell' },
  { id: 'biology_diaphragm_muscle_contraction', name: 'Biology Diaphragm Muscle Contraction', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_diaphragm_muscle_contraction.js', importName: 'createDiaphragm' },
  { id: 'biology_digestive_intestinal_villi', name: 'Biology Digestive Intestinal Villi', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_digestive_intestinal_villi.js', importName: 'createIntestinalVilli' },
  { id: 'biology_digestive_liver_lobule', name: 'Biology Digestive Liver Lobule', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_digestive_liver_lobule.js', importName: 'createLiverLobule' },
  { id: 'biology_digestive_pancreatic_islet', name: 'Biology Digestive Pancreatic Islet', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_digestive_pancreatic_islet.js', importName: 'createPancreaticIslet' },
  { id: 'biology_digestive_peristalsis', name: 'Biology Digestive Peristalsis', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_digestive_peristalsis.js', importName: 'createPeristalsisMechanism' },
  { id: 'biology_digestive_stomach_parietal_cell', name: 'Biology Digestive Stomach Parietal Cell', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_digestive_stomach_parietal_cell.js', importName: 'createStomachParietalCell' },
  { id: 'biology_dna_helicase', name: 'Biology Dna Helicase', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_dna_helicase.js', importName: 'createDNAHelicase' },
  { id: 'biology_dna_microarray', name: 'Biology Dna Microarray', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_dna_microarray.js', importName: 'createDNAMicroarray' },
  { id: 'biology_ecoli_motor', name: 'Biology Ecoli Motor', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_ecoli_motor.js', importName: 'createEcoliMotor' },
  { id: 'biology_endoplasmic_reticulum', name: 'Biology Endoplasmic Reticulum', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_endoplasmic_reticulum.js', importName: 'createEndoplasmicReticulum' },
  { id: 'biology_endospore_formation', name: 'Biology Endospore Formation', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_endospore_formation.js', importName: 'createEndosporeFormation' },
  { id: 'biology_golgi_apparatus', name: 'Biology Golgi Apparatus', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_golgi_apparatus.js', importName: 'createGolgiApparatus' },
  { id: 'biology_gram_negative_wall', name: 'Biology Gram Negative Wall', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_gram_negative_wall.js', importName: 'createGramNegativeWall' },
  { id: 'biology_grasshopper_leg', name: 'Biology Grasshopper Leg', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_grasshopper_leg.js', importName: 'createGrasshopperLeg' },
  { id: 'biology_haversian_system', name: 'Biology Haversian System', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_haversian_system.js', importName: 'createHaversianSystem' },
  { id: 'biology_heart_pump', name: 'Biology Heart Pump', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_heart_pump.js', importName: 'createHeartPump' },
  { id: 'biology_hippocampus', name: 'Biology Hippocampus', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_hippocampus.js', importName: 'createHippocampus' },
  { id: 'biology_h_pylori_burrowing', name: 'Biology H Pylori Burrowing', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_h_pylori_burrowing.js', importName: 'createHPyloriBurrowing' },
  { id: 'biology_inner_ear_cochlea', name: 'Biology Inner Ear Cochlea', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_inner_ear_cochlea.js', importName: 'createInnerEarCochlea' },
  { id: 'biology_intervertebral_disc', name: 'Biology Intervertebral Disc', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_intervertebral_disc.js', importName: 'createIntervertebralDisc' },
  { id: 'biology_jellyfish_nematocyst', name: 'Biology Jellyfish Nematocyst', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_jellyfish_nematocyst.js', importName: 'createJellyfishNematocyst' },
  { id: 'biology_ligase', name: 'Biology Ligase', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_ligase.js', importName: 'createLigase' },
  { id: 'biology_lysosome', name: 'Biology Lysosome', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_lysosome.js', importName: 'createLysosome' },
  { id: 'biology_macrophage', name: 'Biology Macrophage', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_macrophage.js', importName: 'createMacrophage' },
  { id: 'biology_mitral_valve', name: 'Biology Mitral Valve', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_mitral_valve.js', importName: 'createMitralValve' },
  { id: 'biology_mosquito_proboscis', name: 'Biology Mosquito Proboscis', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_mosquito_proboscis.js', importName: 'createMosquitoProboscis' },
  { id: 'biology_muscle_sarcomere', name: 'Biology Muscle Sarcomere', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_muscle_sarcomere.js', importName: 'createMuscleSarcomere' },
  { id: 'biology_octopus_sucker', name: 'Biology Octopus Sucker', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_octopus_sucker.js', importName: 'createOctopusSucker' },
  { id: 'biology_optic_nerve', name: 'Biology Optic Nerve', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_optic_nerve.js', importName: 'createOpticNervePathway' },
  { id: 'biology_osteoblast_formation', name: 'Biology Osteoblast Formation', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_osteoblast_formation.js', importName: 'createOsteoblastFormation' },
  { id: 'biology_osteoclast_resorption', name: 'Biology Osteoclast Resorption', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_osteoclast_resorption.js', importName: 'createOsteoclastResorption' },
  { id: 'biology_peroxisome', name: 'Biology Peroxisome', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_peroxisome.js', importName: 'createPeroxisome' },
  { id: 'biology_phloem_sieve_tube', name: 'Biology Phloem Sieve Tube', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_phloem_sieve_tube.js', importName: 'createPhloemSieveTube' },
  { id: 'biology_plasmid_conjugation', name: 'Biology Plasmid Conjugation', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_plasmid_conjugation.js', importName: 'createPlasmidConjugation' },
  { id: 'biology_red_blood_cell', name: 'Biology Red Blood Cell', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_red_blood_cell.js', importName: 'createRedBloodCell' },
  { id: 'biology_retrovirus', name: 'Biology Retrovirus', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_retrovirus.js', importName: 'createRetrovirusIntegration' },
  { id: 'biology_rna_primase', name: 'Biology Rna Primase', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_rna_primase.js', importName: 'createRNAPrimase' },
  { id: 'biology_rna_transcription', name: 'Biology Rna Transcription', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_rna_transcription.js', importName: 'createRNATranscription' },
  { id: 'biology_root_apical_meristem', name: 'Biology Root Apical Meristem', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_root_apical_meristem.js', importName: 'createRootApicalMeristem' },
  { id: 'biology_shark_gills', name: 'Biology Shark Gills', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_shark_gills.js', importName: 'createSharkGills' },
  { id: 'biology_sinoatrial_node', name: 'Biology Sinoatrial Node', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_sinoatrial_node.js', importName: 'createSinoatrialNode' },
  { id: 'biology_stomata_cells', name: 'Biology Stomata Cells', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_stomata_cells.js', importName: 'createStomataCells' },
  { id: 'biology_synaptic_cleft', name: 'Biology Synaptic Cleft', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_synaptic_cleft.js', importName: 'createSynapticCleft' },
  { id: 'biology_synovial_joint', name: 'Biology Synovial Joint', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_synovial_joint.js', importName: 'createSynovialJoint' },
  { id: 'biology_t4_bacteriophage', name: 'Biology T4 Bacteriophage', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_t4_bacteriophage.js', importName: 'createT4Bacteriophage' },
  { id: 'biology_tcell', name: 'Biology Tcell', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_tcell.js', importName: 'createTCell' },
  { id: 'biology_thalamus_relay', name: 'Biology Thalamus Relay', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_thalamus_relay.js', importName: 'createThalamusRelay' },
  { id: 'biology_thylakoid_stack', name: 'Biology Thylakoid Stack', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_thylakoid_stack.js', importName: 'createThylakoidStack' },
  { id: 'biology_topoisomerase', name: 'Biology Topoisomerase', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_topoisomerase.js', importName: 'createTopoisomerase' },
  { id: 'biology_tracheal_cilia_sweep', name: 'Biology Tracheal Cilia Sweep', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_tracheal_cilia_sweep.js', importName: 'createTrachealCilia' },
  { id: 'biology_vocal_cords_larynx', name: 'Biology Vocal Cords Larynx', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_vocal_cords_larynx.js', importName: 'createVocalCords' },
  { id: 'biology_xylem_vessel', name: 'Biology Xylem Vessel', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biology_xylem_vessel.js', importName: 'createXylemVessel' },
  { id: 'biomechanics_artificial_heart', name: 'Biomechanics Artificial Heart', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomechanics_artificial_heart.js', importName: 'createArtificialHeart' },
  { id: 'biomechanics_exoskeleton', name: 'Biomechanics Exoskeleton', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomechanics_exoskeleton.js', importName: 'createExoskeletonArm' },
  { id: 'biomechanics_muscle_sarcomere', name: 'Biomechanics Muscle Sarcomere', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomechanics_muscle_sarcomere.js', importName: 'createMuscleSarcomere' },
  { id: 'biomechanics_running_blade', name: 'Biomechanics Running Blade', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomechanics_running_blade.js', importName: 'createRunningBlade' },
  { id: 'biomechanics_spine_implant', name: 'Biomechanics Spine Implant', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomechanics_spine_implant.js', importName: 'createSpineImplant' },
  { id: 'biomedical_artificial_heart_valve', name: 'Biomedical Artificial Heart Valve', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_artificial_heart_valve.js', importName: 'createArtificialHeartValve' },
  { id: 'biomedical_bionic_hand', name: 'Biomedical Bionic Hand', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_bionic_hand.js', importName: 'createBionicProstheticHand' },
  { id: 'biomedical_cpap_blower', name: 'Biomedical Cpap Blower', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_cpap_blower.js', importName: 'createCPAPMachineBlower' },
  { id: 'biomedical_defibrillator', name: 'Biomedical Defibrillator', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_defibrillator.js', importName: 'createPortableDefibrillator' },
  { id: 'biomedical_dialysis_filter', name: 'Biomedical Dialysis Filter', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_dialysis_filter.js', importName: 'createDialysisFilter' },
  { id: 'biomedical_dialysis_machine', name: 'Biomedical Dialysis Machine', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_dialysis_machine.js', importName: 'createDialysisMachine' },
  { id: 'biomedical_dna_sequencer', name: 'Biomedical Dna Sequencer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_dna_sequencer.js', importName: 'createDNASequencer' },
  { id: 'biomedical_heart_pump', name: 'Biomedical Heart Pump', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_heart_pump.js', importName: 'createHeartPump' },
  { id: 'biomedical_insulin_pump', name: 'Biomedical Insulin Pump', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_insulin_pump.js', importName: 'createInsulinPump' },
  { id: 'biomedical_mri_scanner', name: 'Biomedical Mri Scanner', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_mri_scanner.js', importName: 'createMRIScanner' },
  { id: 'biomedical_pacemaker_lead', name: 'Biomedical Pacemaker Lead', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_pacemaker_lead.js', importName: 'createPacemakerLead' },
  { id: 'biomedical_pulse_oximeter', name: 'Biomedical Pulse Oximeter', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_pulse_oximeter.js', importName: 'createPulseOximeter' },
  { id: 'biomedical_robotic_surgery', name: 'Biomedical Robotic Surgery', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_robotic_surgery.js', importName: 'createRoboticSurgery' },
  { id: 'biomedical_syringe_pump', name: 'Biomedical Syringe Pump', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_syringe_pump.js', importName: 'createSyringePump' },
  { id: 'biomolecules', name: 'Biomolecules', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomolecules.js', importName: 'createBiomolecules' },
  { id: 'bionics_artificial_heart', name: 'Bionics Artificial Heart', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_artificial_heart.js', importName: 'createArtificialHeart' },
  { id: 'bionics_artificial_retina', name: 'Bionics Artificial Retina', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_artificial_retina.js', importName: 'createArtificialRetina' },
  { id: 'bionics_bionic_eye', name: 'Bionics Bionic Eye', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_bionic_eye.js', importName: 'createBionicEye' },
  { id: 'bionics_bionic_hand', name: 'Bionics Bionic Hand', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_bionic_hand.js', importName: 'createBionicHand' },
  { id: 'bionics_cybernetic_arm', name: 'Bionics Cybernetic Arm', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_cybernetic_arm.js', importName: 'createCyberneticArm' },
  { id: 'bionics_cybernetic_heart', name: 'Bionics Cybernetic Heart', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_cybernetic_heart.js', importName: 'createCyberneticHeart' },
  { id: 'bionics_cybernetic_heart_pump', name: 'Bionics Cybernetic Heart Pump', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_cybernetic_heart_pump.js', importName: 'createCyberneticHeartPump' },
  { id: 'bionics_exoskeleton_leg', name: 'Bionics Exoskeleton Leg', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_exoskeleton_leg.js', importName: 'createBionicLeg' },
  { id: 'bionics_neural_implant', name: 'Bionics Neural Implant', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_neural_implant.js', importName: 'createNeuralImplant' },
  { id: 'bionics_neural_interface', name: 'Bionics Neural Interface', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_neural_interface.js', importName: 'createNeuralInterface' },
  { id: 'bionics_neural_lace', name: 'Bionics Neural Lace', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_neural_lace.js', importName: 'createNeuralLace' },
  { id: 'bionics_prosthetic_arm', name: 'Bionics Prosthetic Arm', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_prosthetic_arm.js', importName: 'createProstheticArm' },
  { id: 'bionics_retinal_implant', name: 'Bionics Retinal Implant', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_retinal_implant.js', importName: 'createRetinalImplant' },
  { id: 'bionics_robotic_hand', name: 'Bionics Robotic Hand', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_robotic_hand.js', importName: 'createRoboticHand' },
  { id: 'bionics_synthetic_eye', name: 'Bionics Synthetic Eye', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bionics_synthetic_eye.js', importName: 'createSyntheticEye' },
  { id: 'bioreactor_system', name: 'Bioreactor System', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bioreactor_system.js', importName: 'createBioreactorSystem' },
  { id: 'biotech_bioreactor_tank', name: 'Biotech Bioreactor Tank', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_bioreactor_tank.js', importName: 'createBioreactor' },
  { id: 'biotech_crispr_cas9', name: 'Biotech Crispr Cas9', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_crispr_cas9.js', importName: 'createCRISPRCas9' },
  { id: 'biotech_dialysis_filter', name: 'Biotech Dialysis Filter', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_dialysis_filter.js', importName: 'createDialysisFilter' },
  { id: 'biotech_dna_sequencer', name: 'Biotech Dna Sequencer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_dna_sequencer.js', importName: 'createDNASequencer' },
  { id: 'biotech_electroporation_membrane', name: 'Biotech Electroporation Membrane', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_electroporation_membrane.js', importName: 'createElectroporationMembrane' },
  { id: 'biotech_flow_cytometer', name: 'Biotech Flow Cytometer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_flow_cytometer.js', importName: 'createFlowCytometer' },
  { id: 'biotech_gene_gun', name: 'Biotech Gene Gun', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_gene_gun.js', importName: 'createGeneGun' },
  { id: 'biotech_incubator_shaker', name: 'Biotech Incubator Shaker', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_incubator_shaker.js', importName: 'createIncubatorShaker' },
  { id: 'biotech_liquid_handling', name: 'Biotech Liquid Handling', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_liquid_handling.js', importName: 'createAutomatedPipette' },
  { id: 'biotech_mass_spectrometer', name: 'Biotech Mass Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_mass_spectrometer.js', importName: 'createMassSpectrometer' },
  { id: 'biotech_microfluidic_chip', name: 'Biotech Microfluidic Chip', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_microfluidic_chip.js', importName: 'createMicrofluidicChip' },
  { id: 'biotech_mri_magnet', name: 'Biotech Mri Magnet', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_mri_magnet.js', importName: 'createMRIMagnet' },
  { id: 'biotech_pcr_thermocycler', name: 'Biotech Pcr Thermocycler', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_pcr_thermocycler.js', importName: 'createPCRThermocycler' },
  { id: 'biotech_petri_plater', name: 'Biotech Petri Plater', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_petri_plater.js', importName: 'createPetriPlater' },
  { id: 'biotech_spectrophotometer_cuvette', name: 'Biotech Spectrophotometer Cuvette', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biotech_spectrophotometer_cuvette.js', importName: 'createSpectrophotometerCuvette' },
  { id: 'bio_algae_plastic_reactor', name: 'Bio Algae Plastic Reactor', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_algae_plastic_reactor.js', importName: 'createAlgaeReactor' },
  { id: 'bio_algal_photobioreactor', name: 'Bio Algal Photobioreactor', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_algal_photobioreactor.js', importName: 'createAlgalPhotobioreactor' },
  { id: 'bio_capillary_network_extruder', name: 'Bio Capillary Network Extruder', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_capillary_network_extruder.js', importName: 'createCapillaryNetworkExtruder' },
  { id: 'bio_cellulose_nanofiber_mixer', name: 'Bio Cellulose Nanofiber Mixer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_cellulose_nanofiber_mixer.js', importName: 'createCelluloseMixer' },
  { id: 'bio_chitin_exoskeleton_weaver', name: 'Bio Chitin Exoskeleton Weaver', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_chitin_exoskeleton_weaver.js', importName: 'createChitinWeaver' },
  { id: 'bio_enzyme_bio_battery', name: 'Bio Enzyme Bio Battery', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_enzyme_bio_battery.js', importName: 'createEnzymeBioBattery' },
  { id: 'bio_heart_valve_printer', name: 'Bio Heart Valve Printer', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_heart_valve_printer.js', importName: 'createHeartValvePrinter' },
  { id: 'bio_methane_digester', name: 'Bio Methane Digester', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_methane_digester.js', importName: 'createBioMethaneDigester' },
  { id: 'bio_microbial_fuel_cell', name: 'Bio Microbial Fuel Cell', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_microbial_fuel_cell.js', importName: 'createMicrobialFuelCellArray' },
  { id: 'bio_mycelium_brick_press', name: 'Bio Mycelium Brick Press', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_mycelium_brick_press.js', importName: 'createMyceliumPress' },
  { id: 'bio_neural_interface_scaffold', name: 'Bio Neural Interface Scaffold', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_neural_interface_scaffold.js', importName: 'createNeuralInterfaceScaffold' },
  { id: 'bio_photosynthetic_harvester', name: 'Bio Photosynthetic Harvester', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_photosynthetic_harvester.js', importName: 'createPhotosyntheticProteinHarvester' },
  { id: 'bio_spider_silk_spinneret', name: 'Bio Spider Silk Spinneret', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_spider_silk_spinneret.js', importName: 'createSilkSpinneret' },
  { id: 'bio_stem_cell_incubator', name: 'Bio Stem Cell Incubator', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_stem_cell_incubator.js', importName: 'createStemCellIncubator' },
  { id: 'bio_synthetic_organ_matrix', name: 'Bio Synthetic Organ Matrix', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/bio_synthetic_organ_matrix.js', importName: 'createSyntheticOrganMatrix' },
  { id: 'carbon_cycle', name: 'Carbon Cycle', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/carbon_cycle.js', importName: 'createCarbonCycle' },
  { id: 'e_coli_bacterium', name: 'E Coli Bacterium', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/e_coli_bacterium.js', importName: 'createEColiBacterium' },
  { id: 'forest_canopy', name: 'Forest Canopy', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/forest_canopy.js', importName: 'createForestCanopy' },
  { id: 'gas_chromatograph', name: 'Gas Chromatograph', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/gas_chromatograph.js', importName: 'createGasChromatograph' },
  { id: 'genetics_chromosome', name: 'Genetics Chromosome', icon: '&#x2699;&#xFE0F;', category: 'genetics', importPath: './machines/genetics_chromosome.js', importName: 'createChromosome' },
  { id: 'genetics_dna_helix', name: 'Genetics Dna Helix', icon: '&#x2699;&#xFE0F;', category: 'genetics', importPath: './machines/genetics_dna_helix.js', importName: 'createDNAHelix' },
  { id: 'genetics_mitosis', name: 'Genetics Mitosis', icon: '&#x2699;&#xFE0F;', category: 'genetics', importPath: './machines/genetics_mitosis.js', importName: 'createMitosis' },
  { id: 'genetics_rna_transcription', name: 'Genetics Rna Transcription', icon: '&#x2699;&#xFE0F;', category: 'genetics', importPath: './machines/genetics_rna_transcription.js', importName: 'createRNATranscription' },
  { id: 'immunology_antibody', name: 'Immunology Antibody', icon: '&#x2699;&#xFE0F;', category: 'immunology', importPath: './machines/immunology_antibody.js', importName: 'createAntibodyBinding' },
  { id: 'immunology_complement', name: 'Immunology Complement', icon: '&#x2699;&#xFE0F;', category: 'immunology', importPath: './machines/immunology_complement.js', importName: 'createComplementSystem' },
  { id: 'immunology_macrophage', name: 'Immunology Macrophage', icon: '&#x2699;&#xFE0F;', category: 'immunology', importPath: './machines/immunology_macrophage.js', importName: 'createMacrophage' },
  { id: 'immunology_tcell', name: 'Immunology Tcell', icon: '&#x2699;&#xFE0F;', category: 'immunology', importPath: './machines/immunology_tcell.js', importName: 'createTCellActivation' },
  { id: 'immunology_virus', name: 'Immunology Virus', icon: '&#x2699;&#xFE0F;', category: 'immunology', importPath: './machines/immunology_virus.js', importName: 'createVirusNeutralization' },
  { id: 'microarray_scanner', name: 'Microarray Scanner', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/microarray_scanner.js', importName: 'createMicroarrayScanner' },
  { id: 'microbiology_bacteriophage', name: 'Microbiology Bacteriophage', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbiology_bacteriophage.js', importName: 'createBacteriophage' },
  { id: 'microbiology_dna_helix', name: 'Microbiology Dna Helix', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbiology_dna_helix.js', importName: 'createDNAHelix' },
  { id: 'microbiology_flagellum_motor', name: 'Microbiology Flagellum Motor', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbiology_flagellum_motor.js', importName: 'createFlagellumMotor' },
  { id: 'microbiology_virus', name: 'Microbiology Virus', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbiology_virus.js', importName: 'createVirus' },
  { id: 'microbio_autoclave_sterilizer', name: 'Microbio Autoclave Sterilizer', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_autoclave_sterilizer.js', importName: 'createAutoclaveSterilizer' },
  { id: 'microbio_automated_petri_dish_analyzer', name: 'Microbio Automated Petri Dish Analyzer', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_automated_petri_dish_analyzer.js', importName: 'createAutomatedPetriDishAnalyzer' },
  { id: 'microbio_biosafety_cabinet_class_ii', name: 'Microbio Biosafety Cabinet Class Ii', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_biosafety_cabinet_class_ii.js', importName: 'createBiosafetyCabinetClassII' },
  { id: 'microbio_cell_sorter_flow_cytometer', name: 'Microbio Cell Sorter Flow Cytometer', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_cell_sorter_flow_cytometer.js', importName: 'createCellSorterFlowCytometer' },
  { id: 'microbio_centrifugal_filter', name: 'Microbio Centrifugal Filter', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_centrifugal_filter.js', importName: 'createCentrifugalFilterUnit' },
  { id: 'microbio_co2_incubator', name: 'Microbio Co2 Incubator', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_co2_incubator.js', importName: 'createCO2Incubator' },
  { id: 'microbio_electrophoresis_chamber', name: 'Microbio Electrophoresis Chamber', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_electrophoresis_chamber.js', importName: 'createElectrophoresisChamber' },
  { id: 'microbio_fluorescence_microscope', name: 'Microbio Fluorescence Microscope', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_fluorescence_microscope.js', importName: 'createFluorescenceMicroscope' },
  { id: 'microbio_mass_spectrometer', name: 'Microbio Mass Spectrometer', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_mass_spectrometer.js', importName: 'createMassSpectrometer' },
  { id: 'microbio_microtome_slicer', name: 'Microbio Microtome Slicer', icon: '&#x2699;&#xFE0F;', category: 'microbiology', importPath: './machines/microbio_microtome_slicer.js', importName: 'createMicrotomeSlicer' },
  { id: 'mitochondria_powerhouse', name: 'Mitochondria Powerhouse', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mitochondria_powerhouse.js', importName: 'createMitochondriaPowerhouse' },
  { id: 'neuroscience_brain_lobes', name: 'Neuroscience Brain Lobes', icon: '&#x2699;&#xFE0F;', category: 'neuroscience', importPath: './machines/neuroscience_brain_lobes.js', importName: 'createBrainLobes' },
  { id: 'neuroscience_eeg_brainwaves', name: 'Neuroscience Eeg Brainwaves', icon: '&#x2699;&#xFE0F;', category: 'neuroscience', importPath: './machines/neuroscience_eeg_brainwaves.js', importName: 'createEEGBrainwaves' },
  { id: 'neuroscience_neural_network', name: 'Neuroscience Neural Network', icon: '&#x2699;&#xFE0F;', category: 'neuroscience', importPath: './machines/neuroscience_neural_network.js', importName: 'createNeuralNetwork' },
  { id: 'nitrogen_cycle', name: 'Nitrogen Cycle', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nitrogen_cycle.js', importName: 'createNitrogenCycle' },
  { id: 'organic', name: 'Organic', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic.js', importName: 'createOrganicReactions' },
  { id: 'organic_benzene_resonance', name: 'Organic Benzene Resonance', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic_benzene_resonance.js', importName: 'createBenzeneResonance' },
  { id: 'organic_chiral_enantiomers', name: 'Organic Chiral Enantiomers', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic_chiral_enantiomers.js', importName: 'createChiralEnantiomers' },
  { id: 'organic_cyclohexane_chair_flip', name: 'Organic Cyclohexane Chair Flip', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic_cyclohexane_chair_flip.js', importName: 'createCyclohexaneChairFlip' },
  { id: 'organic_peptide_bond_formation', name: 'Organic Peptide Bond Formation', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic_peptide_bond_formation.js', importName: 'createPeptideBondFormation' },
  { id: 'organic_phase4', name: 'Organic Phase4', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic_phase4.js', importName: 'createOrganicPhase4' },
  { id: 'organic_sn2_reaction', name: 'Organic Sn2 Reaction', icon: '&#x2699;&#xFE0F;', category: 'organic_chemistry', importPath: './machines/organic_sn2_reaction.js', importName: 'createSn2Reaction' },
  { id: 'paleontology_ammonite_shell', name: 'Paleontology Ammonite Shell', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_ammonite_shell.js', importName: 'createAmmoniteShell' },
  { id: 'paleontology_bone_preservator', name: 'Paleontology Bone Preservator', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_bone_preservator.js', importName: 'createBonePreservator' },
  { id: 'paleontology_carbon_dater', name: 'Paleontology Carbon Dater', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_carbon_dater.js', importName: 'createCarbonDater' },
  { id: 'paleontology_fossil_excavation', name: 'Paleontology Fossil Excavation', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_fossil_excavation.js', importName: 'createFossilExcavation' },
  { id: 'paleontology_fossil_excavator', name: 'Paleontology Fossil Excavator', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_fossil_excavator.js', importName: 'createFossilExcavator' },
  { id: 'paleontology_geo_radar_scanner', name: 'Paleontology Geo Radar Scanner', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_geo_radar_scanner.js', importName: 'createGeoRadarScanner' },
  { id: 'paleontology_pterodactyl', name: 'Paleontology Pterodactyl', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_pterodactyl.js', importName: 'createPterodactyl' },
  { id: 'paleontology_strata_driller', name: 'Paleontology Strata Driller', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_strata_driller.js', importName: 'createStrataDriller' },
  { id: 'paleontology_trilobite', name: 'Paleontology Trilobite', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_trilobite.js', importName: 'createTrilobite' },
  { id: 'paleontology_t_rex_skeleton', name: 'Paleontology T Rex Skeleton', icon: '&#x2699;&#xFE0F;', category: 'paleontology', importPath: './machines/paleontology_t_rex_skeleton.js', importName: 'createTRexSkeleton' },
  { id: 'pcr_thermal_cycler', name: 'Pcr Thermal Cycler', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pcr_thermal_cycler.js', importName: 'createPCRThermalCycler' },
  { id: 'pterosaur_wing', name: 'Pterosaur Wing', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/pterosaur_wing.js', importName: 'createPterosaurWing' },
  { id: 'ribosome_translation', name: 'Ribosome Translation', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/ribosome_translation.js', importName: 'createRibosomeTranslation' },
  { id: 'synthbio_artificial_cell', name: 'Synthbio Artificial Cell', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/synthbio_artificial_cell.js', importName: 'createArtificialCell' },
  { id: 'synthbio_biosensor_circuit', name: 'Synthbio Biosensor Circuit', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/synthbio_biosensor_circuit.js', importName: 'createBiosensorCircuit' },
  { id: 'synthbio_dna_synthesizer', name: 'Synthbio Dna Synthesizer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/synthbio_dna_synthesizer.js', importName: 'createDNASynthesizer' },
  { id: 'synthbio_engineered_phage', name: 'Synthbio Engineered Phage', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/synthbio_engineered_phage.js', importName: 'createEngineeredPhage' },
  { id: 'synthbio_synthetic_ribosome', name: 'Synthbio Synthetic Ribosome', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/synthbio_synthetic_ribosome.js', importName: 'createSyntheticRibosome' },
  { id: 'trex_skeleton', name: 'Trex Skeleton', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/trex_skeleton.js', importName: 'createTrexSkeleton' },
  { id: 'triceratops_skull', name: 'Triceratops Skull', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/triceratops_skull.js', importName: 'createTriceratopsSkull' },

  { id: 'environmental_dissolved_air_flotation_unit', name: 'Environmental Dissolved Air Flotation Unit', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/environmental_dissolved_air_flotation_unit.js', importName: 'createDissolvedAirFlotationUnit' },
  { id: 'environmental_electrostatic_precipitator', name: 'Environmental Electrostatic Precipitator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/environmental_electrostatic_precipitator.js', importName: 'createElectrostaticPrecipitator' },
  { id: 'environmental_membrane_bioreactor_tank', name: 'Environmental Membrane Bioreactor Tank', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/environmental_membrane_bioreactor_tank.js', importName: 'createMembraneBioreactorTank' },
  { id: 'environmental_reverse_osmosis_desalination_skid', name: 'Environmental Reverse Osmosis Desalination Skid', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/environmental_reverse_osmosis_desalination_skid.js', importName: 'createReverseOsmosisDesalinationSkid' },
  { id: 'environmental_sludge_dewatering_centrifuge', name: 'Environmental Sludge Dewatering Centrifuge', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/environmental_sludge_dewatering_centrifuge.js', importName: 'createSludgeDewateringCentrifuge' },
  { id: 'fire_protection_fire_hydrant', name: 'Fire Protection Fire Hydrant', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fire_protection_fire_hydrant.js', importName: 'createFireHydrant' },
  { id: 'fire_protection_fire_pump_centrifugal', name: 'Fire Protection Fire Pump Centrifugal', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fire_protection_fire_pump_centrifugal.js', importName: 'createFirePumpCentrifugal' },
  { id: 'fire_protection_foam_proportioner', name: 'Fire Protection Foam Proportioner', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fire_protection_foam_proportioner.js', importName: 'createFoamProportioner' },
  { id: 'fire_protection_water_motor_gong', name: 'Fire Protection Water Motor Gong', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/fire_protection_water_motor_gong.js', importName: 'createWaterMotorGong' },
  { id: 'hardware_fpga_board', name: 'Hardware Fpga Board', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hardware_fpga_board.js', importName: 'createFPGABoard' },
  { id: 'hardware_gpu_heatsink', name: 'Hardware Gpu Heatsink', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hardware_gpu_heatsink.js', importName: 'createGPUHeatsink' },
  { id: 'hardware_nvme_ssd', name: 'Hardware Nvme Ssd', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hardware_nvme_ssd.js', importName: 'createNVMeSSD' },
  { id: 'hardware_pcie_slot', name: 'Hardware Pcie Slot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hardware_pcie_slot.js', importName: 'createPCIeSlot' },
  { id: 'hardware_ram_dimm', name: 'Hardware Ram Dimm', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hardware_ram_dimm.js', importName: 'createRAMDimm' },
  { id: 'hvac_evaporative_cooling_tower', name: 'Hvac Evaporative Cooling Tower', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hvac_evaporative_cooling_tower.js', importName: 'createEvaporativeCoolingTower' },
  { id: 'hvac_rooftop_packaged_unit', name: 'Hvac Rooftop Packaged Unit', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hvac_rooftop_packaged_unit.js', importName: 'createRooftopPackagedUnit' },
  { id: 'hvac_rotary_enthalpy_wheel', name: 'Hvac Rotary Enthalpy Wheel', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hvac_rotary_enthalpy_wheel.js', importName: 'createRotaryEnthalpyWheel' },
  { id: 'hvac_vrf_outdoor_unit', name: 'Hvac Vrf Outdoor Unit', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hvac_vrf_outdoor_unit.js', importName: 'createVRFOutdoorUnit' },
  { id: 'hvac_water_cooled_chiller', name: 'Hvac Water Cooled Chiller', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/hvac_water_cooled_chiller.js', importName: 'createWaterCooledChiller' },
  { id: 'manufacturing_aoi_system', name: 'Manufacturing Aoi System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/manufacturing_aoi_system.js', importName: 'createAOISystem' },
  { id: 'manufacturing_extrusion_die_head', name: 'Manufacturing Extrusion Die Head', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/manufacturing_extrusion_die_head.js', importName: 'createExtrusionDieHead' },
  { id: 'manufacturing_injection_molding_platen', name: 'Manufacturing Injection Molding Platen', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/manufacturing_injection_molding_platen.js', importName: 'createInjectionMoldingPlaten' },
  { id: 'manufacturing_six_axis_welding_robot', name: 'Manufacturing Six Axis Welding Robot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/manufacturing_six_axis_welding_robot.js', importName: 'createSixAxisWeldingRobot' },
  { id: 'manufacturing_vibratory_bowl_feeder', name: 'Manufacturing Vibratory Bowl Feeder', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/manufacturing_vibratory_bowl_feeder.js', importName: 'createVibratoryBowlFeeder' },
  { id: 'marine_anchor_windlass', name: 'Marine Anchor Windlass', icon: '&#x2699;&#xFE0F;', category: 'marine_biology', importPath: './machines/marine_anchor_windlass.js', importName: 'createAnchorWindlass' },
  { id: 'marine_ship_stabilizer_fin', name: 'Marine Ship Stabilizer Fin', icon: '&#x2699;&#xFE0F;', category: 'marine_biology', importPath: './machines/marine_ship_stabilizer_fin.js', importName: 'createShipStabilizerFin' },
  { id: 'mechatronics_agv', name: 'Mechatronics Agv', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mechatronics_agv.js', importName: 'createAGV' },
  { id: 'mechatronics_cnc_spindle', name: 'Mechatronics Cnc Spindle', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mechatronics_cnc_spindle.js', importName: 'createCNCMillingSpindle' },
  { id: 'mechatronics_delta_robot', name: 'Mechatronics Delta Robot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mechatronics_delta_robot.js', importName: 'createDeltaRobot' },
  { id: 'mechatronics_linear_actuator', name: 'Mechatronics Linear Actuator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mechatronics_linear_actuator.js', importName: 'createLinearActuatorStage' },
  { id: 'mechatronics_scara_robot', name: 'Mechatronics Scara Robot', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mechatronics_scara_robot.js', importName: 'createSCARARobot' },
  { id: 'mining_dragline_bucket', name: 'Mining Dragline Bucket', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mining_dragline_bucket.js', importName: 'createDraglineBucket' },
  { id: 'mining_longwall_shearer', name: 'Mining Longwall Shearer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/mining_longwall_shearer.js', importName: 'createLongwallShearer' },
  { id: 'nuclear_control_rod_drive_mechanism', name: 'Nuclear Control Rod Drive Mechanism', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nuclear_control_rod_drive_mechanism.js', importName: 'createControlRodDriveMechanism' },
  { id: 'nuclear_pressurized_water_reactor_core', name: 'Nuclear Pressurized Water Reactor Core', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nuclear_pressurized_water_reactor_core.js', importName: 'createPressurizedWaterReactorCore' },
  { id: 'nuclear_spent_fuel_cask', name: 'Nuclear Spent Fuel Cask', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/nuclear_spent_fuel_cask.js', importName: 'createSpentFuelCask' },
  { id: 'optical_adaptive_optics_deformable_mirror', name: 'Optical Adaptive Optics Deformable Mirror', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/optical_adaptive_optics_deformable_mirror.js', importName: 'createAdaptiveOpticsDeformableMirror' },
  { id: 'optical_confocal_microscope', name: 'Optical Confocal Microscope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/optical_confocal_microscope.js', importName: 'createConfocalMicroscope' },
  { id: 'optical_free_space_communicator', name: 'Optical Free Space Communicator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/optical_free_space_communicator.js', importName: 'createFreeSpaceOpticalCommunicator' },
  { id: 'optical_spectrometer_grating', name: 'Optical Spectrometer Grating', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/optical_spectrometer_grating.js', importName: 'createSpectrometerGrating' },
  { id: 'petroleum_blowout_preventer', name: 'Petroleum Blowout Preventer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/petroleum_blowout_preventer.js', importName: 'createBlowoutPreventer' },
  { id: 'petroleum_mud_motor', name: 'Petroleum Mud Motor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/petroleum_mud_motor.js', importName: 'createMudMotor' },
  { id: 'petroleum_progressive_cavity_pump', name: 'Petroleum Progressive Cavity Pump', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/petroleum_progressive_cavity_pump.js', importName: 'createProgressiveCavityPump' },
  { id: 'petroleum_rotary_steerable_system', name: 'Petroleum Rotary Steerable System', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/petroleum_rotary_steerable_system.js', importName: 'createRotarySteerableSystem' },
  { id: 'telecom_baseband_processing_unit', name: 'Telecom Baseband Processing Unit', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/telecom_baseband_processing_unit.js', importName: 'createBasebandProcessingUnit' },
  { id: 'telecom_cell_tower_antenna_array', name: 'Telecom Cell Tower Antenna Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/telecom_cell_tower_antenna_array.js', importName: 'createCellTowerAntennaArray' },
  { id: 'telecom_fiber_optic_splicer', name: 'Telecom Fiber Optic Splicer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/telecom_fiber_optic_splicer.js', importName: 'createFiberOpticSplicer' },
  { id: 'telecom_microwave_parabolic_dish', name: 'Telecom Microwave Parabolic Dish', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/telecom_microwave_parabolic_dish.js', importName: 'createMicrowaveParabolicDish' },
  { id: 'telecom_submarine_cable_repeater', name: 'Telecom Submarine Cable Repeater', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/telecom_submarine_cable_repeater.js', importName: 'createSubmarineCableRepeater' },

  { id: 'acoustic_anechoic_chamber_wedge_array', name: 'Acoustic Anechoic Chamber Wedge Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/acoustic_anechoic_chamber_wedge_array.js', importName: 'createAnechoicChamberWedgeArray' },
  { id: 'acoustic_dynamic_microphone_diaphragm', name: 'Acoustic Dynamic Microphone Diaphragm', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/acoustic_dynamic_microphone_diaphragm.js', importName: 'createDynamicMicrophoneDiaphragm' },
  { id: 'acoustic_helmholtz_resonator', name: 'Acoustic Helmholtz Resonator', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/acoustic_helmholtz_resonator.js', importName: 'createHelmholtzResonator' },
  { id: 'acoustic_levitation_array', name: 'Acoustic Levitation Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/acoustic_levitation_array.js', importName: 'createAcousticLevitationArray' },
  { id: 'acoustic_parametric_speaker_array', name: 'Acoustic Parametric Speaker Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/acoustic_parametric_speaker_array.js', importName: 'createParametricSpeakerArray' },
  { id: 'aerospace_attitude_control_thruster', name: 'Aerospace Attitude Control Thruster', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/aerospace_attitude_control_thruster.js', importName: 'createAttitudeControlThruster' },
  { id: 'aerospace_gyroscope_gimbal_assembly', name: 'Aerospace Gyroscope Gimbal Assembly', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/aerospace_gyroscope_gimbal_assembly.js', importName: 'createGyroscopeGimbalAssembly' },
  { id: 'aerospace_landing_gear_oleo_strut', name: 'Aerospace Landing Gear Oleo Strut', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/aerospace_landing_gear_oleo_strut.js', importName: 'createLandingGearOleoStrut' },
  { id: 'aerospace_turbofan_engine_spool', name: 'Aerospace Turbofan Engine Spool', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/aerospace_turbofan_engine_spool.js', importName: 'createTurbofanEngineSpool' },
  { id: 'aerospace_wind_tunnel_test_section', name: 'Aerospace Wind Tunnel Test Section', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/aerospace_wind_tunnel_test_section.js', importName: 'createWindTunnelTestSection' },
  { id: 'automotive_disc_brake_caliper_assembly', name: 'Automotive Disc Brake Caliper Assembly', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/automotive_disc_brake_caliper_assembly.js', importName: 'createDiscBrakeCaliperAssembly' },
  { id: 'automotive_dual_clutch_transmission', name: 'Automotive Dual Clutch Transmission', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/automotive_dual_clutch_transmission.js', importName: 'createDualClutchTransmission' },
  { id: 'automotive_macpherson_strut_suspension', name: 'Automotive Macpherson Strut Suspension', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/automotive_macpherson_strut_suspension.js', importName: 'createMacPhersonStrutSuspension' },
  { id: 'automotive_rack_and_pinion_steering', name: 'Automotive Rack And Pinion Steering', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/automotive_rack_and_pinion_steering.js', importName: 'createRackAndPinionSteering' },
  { id: 'automotive_turbocharger_impeller', name: 'Automotive Turbocharger Impeller', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/automotive_turbocharger_impeller.js', importName: 'createTurbochargerImpeller' },
  { id: 'biomedical_dialysis_membrane_cartridge', name: 'Biomedical Dialysis Membrane Cartridge', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_dialysis_membrane_cartridge.js', importName: 'createDialysisMembraneCartridge' },
  { id: 'biomedical_mri_scanner_gantry', name: 'Biomedical Mri Scanner Gantry', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_mri_scanner_gantry.js', importName: 'createMRIScannerGantry' },
  { id: 'biomedical_orthopedic_bone_screw_implant', name: 'Biomedical Orthopedic Bone Screw Implant', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_orthopedic_bone_screw_implant.js', importName: 'createOrthopedicBoneScrewImplant' },
  { id: 'biomedical_robotic_surgical_arm', name: 'Biomedical Robotic Surgical Arm', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_robotic_surgical_arm.js', importName: 'createRoboticSurgicalArm' },
  { id: 'biomedical_ventricular_assist_device', name: 'Biomedical Ventricular Assist Device', icon: '&#x2699;&#xFE0F;', category: 'biology', importPath: './machines/biomedical_ventricular_assist_device.js', importName: 'createVentricularAssistDevice' },
  { id: 'chemical_falling_film_evaporator', name: 'Chemical Falling Film Evaporator', icon: '&#x2699;&#xFE0F;', category: 'chemistry', importPath: './machines/chemical_falling_film_evaporator.js', importName: 'createFallingFilmEvaporator' },
  { id: 'chemical_fluidized_bed_roaster', name: 'Chemical Fluidized Bed Roaster', icon: '&#x2699;&#xFE0F;', category: 'chemistry', importPath: './machines/chemical_fluidized_bed_roaster.js', importName: 'createFluidizedBedRoaster' },
  { id: 'chemical_gas_chromatograph_column', name: 'Chemical Gas Chromatograph Column', icon: '&#x2699;&#xFE0F;', category: 'chemistry', importPath: './machines/chemical_gas_chromatograph_column.js', importName: 'createGasChromatographColumn' },
  { id: 'chemical_packed_bed_reactor', name: 'Chemical Packed Bed Reactor', icon: '&#x2699;&#xFE0F;', category: 'chemistry', importPath: './machines/chemical_packed_bed_reactor.js', importName: 'createPackedBedReactor' },
  { id: 'chemical_spray_drying_tower', name: 'Chemical Spray Drying Tower', icon: '&#x2699;&#xFE0F;', category: 'chemistry', importPath: './machines/chemical_spray_drying_tower.js', importName: 'createSprayDryingTower' },
  { id: 'civil_batching_plant', name: 'Civil Batching Plant', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/civil_batching_plant.js', importName: 'createBatchingPlant' },
  { id: 'civil_bridge_pylon', name: 'Civil Bridge Pylon', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/civil_bridge_pylon.js', importName: 'createBridgePylon' },
  { id: 'civil_crawler_crane_boom', name: 'Civil Crawler Crane Boom', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/civil_crawler_crane_boom.js', importName: 'createCrawlerCraneBoom' },
  { id: 'computer_cpu_die_architecture', name: 'Computer Cpu Die Architecture', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/computer_cpu_die_architecture.js', importName: 'createCPUDieArchitecture' },
  { id: 'computer_liquid_cooling_block', name: 'Computer Liquid Cooling Block', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/computer_liquid_cooling_block.js', importName: 'createLiquidCoolingBlock' },
  { id: 'computer_logic_gate_array', name: 'Computer Logic Gate Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/computer_logic_gate_array.js', importName: 'createLogicGateArray' },
  { id: 'computer_memory_controller_hub', name: 'Computer Memory Controller Hub', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/computer_memory_controller_hub.js', importName: 'createMemoryControllerHub' },
  { id: 'computer_pcb_routing_traces', name: 'Computer Pcb Routing Traces', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/computer_pcb_routing_traces.js', importName: 'createPCBRoutingTraces' },
  { id: 'electrical_high_voltage_isolator_switch', name: 'Electrical High Voltage Isolator Switch', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/electrical_high_voltage_isolator_switch.js', importName: 'createHighVoltageIsolatorSwitch' },
  { id: 'electrical_squirrel_cage_rotor', name: 'Electrical Squirrel Cage Rotor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/electrical_squirrel_cage_rotor.js', importName: 'createSquirrelCageRotor' },
  { id: 'electrical_substation_transformer', name: 'Electrical Substation Transformer', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/electrical_substation_transformer.js', importName: 'createSubstationTransformer' },
  { id: 'electrical_three_phase_induction_motor', name: 'Electrical Three Phase Induction Motor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/electrical_three_phase_induction_motor.js', importName: 'createThreePhaseInductionMotor' },
  { id: 'materials_drop_weight_impact_tester', name: 'Materials Drop Weight Impact Tester', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/materials_drop_weight_impact_tester.js', importName: 'createDropWeightImpactTester' },
  { id: 'materials_extrusion_sintering_furnace', name: 'Materials Extrusion Sintering Furnace', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/materials_extrusion_sintering_furnace.js', importName: 'createExtrusionSinteringFurnace' },
  { id: 'materials_scanning_electron_microscope', name: 'Materials Scanning Electron Microscope', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/materials_scanning_electron_microscope.js', importName: 'createScanningElectronMicroscope' },
  { id: 'robotics_bipedal_walking_mechanism', name: 'Robotics Bipedal Walking Mechanism', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_bipedal_walking_mechanism.js', importName: 'createBipedalWalkingMechanism' },
  { id: 'robotics_end_effector_gripper', name: 'Robotics End Effector Gripper', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_end_effector_gripper.js', importName: 'createEndEffectorGripper' },
  { id: 'robotics_harmonic_drive_gear', name: 'Robotics Harmonic Drive Gear', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_harmonic_drive_gear.js', importName: 'createHarmonicDriveGear' },
  { id: 'robotics_lidar_rotating_scanner', name: 'Robotics Lidar Rotating Scanner', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_lidar_rotating_scanner.js', importName: 'createLIDARRotatingScanner' },
  { id: 'robotics_tactile_sensor_array', name: 'Robotics Tactile Sensor Array', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/robotics_tactile_sensor_array.js', importName: 'createTactileSensorArray' },
  { id: 'structural_ibeam_bending_rig', name: 'Structural Ibeam Bending Rig', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/structural_ibeam_bending_rig.js', importName: 'createIBeamBendingRig' },
  { id: 'structural_post_tensioning_anchor', name: 'Structural Post Tensioning Anchor', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/structural_post_tensioning_anchor.js', importName: 'createPostTensioningAnchor' },
  { id: 'structural_wind_mass_damper', name: 'Structural Wind Mass Damper', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/structural_wind_mass_damper.js', importName: 'createWindMassDamper' },
  { id: 'transport_articulated_bus_joint', name: 'Transport Articulated Bus Joint', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/transport_articulated_bus_joint.js', importName: 'createArticulatedBusJoint' },
  { id: 'transport_jet_bridge', name: 'Transport Jet Bridge', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/transport_jet_bridge.js', importName: 'createJetBridge' },
  { id: 'transport_maglev_track', name: 'Transport Maglev Track', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/transport_maglev_track.js', importName: 'createMaglevTrainTrackSegment' },
  { id: 'transport_rail_pantograph', name: 'Transport Rail Pantograph', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/transport_rail_pantograph.js', importName: 'createHighSpeedRailPantograph' },
  { id: 'transport_signal_gantry', name: 'Transport Signal Gantry', icon: '&#x2699;&#xFE0F;', category: 'misc', importPath: './machines/transport_signal_gantry.js', importName: 'createTrafficSignalGantry' }
];
window.ENGISIM_MACHINES = MACHINES;
window.loadMachineById = function(id) { const m = window.ENGISIM_MACHINES.find(x => x.id === id); if (m) loadMachine(m); };

const CATEGORY_MAP = {
  aerodynamics: 'machine-list-aerodynamics',
  propulsion_systems: 'machine-list-propulsion_systems',
  orbital_mechanics: 'machine-list-orbital_mechanics',
  avionics: 'machine-list-avionics',
  spacecraft_engineering: 'machine-list-spacecraft_engineering',
  botany: 'machine-list-botany',
  zoology: 'machine-list-zoology',
  geology: 'machine-list-geology',
  oceanography: 'machine-list-oceanography',
  climatology: 'machine-list-climatology',
  seismology: 'machine-list-seismology',
  volcanology: 'machine-list-volcanology',
  computer_architecture: 'machine-list-computer_architecture',
  networking: 'machine-list-networking',
  cryptography: 'machine-list-cryptography',
  artificial_intelligence: 'machine-list-artificial_intelligence',
  operating_systems: 'machine-list-operating_systems',
  virology: 'machine-list-virology',
  epidemiology: 'machine-list-epidemiology',
  oncology: 'machine-list-oncology',
  cytology: 'machine-list-cytology',
  histology: 'machine-list-histology',
  molecular_biology: 'machine-list-molecular_biology',
  anatomy: 'machine-list-anatomy',
  quantum_physics: 'machine-list-quantum_physics',
  nanotechnology: 'machine-list-nanotechnology',
  astrophysics: 'machine-list-astrophysics',
  meteorology: 'machine-list-meteorology',
  pharmacology: 'machine-list-pharmacology',
  microbiology: 'machine-list-microbiology',
  mechanical: 'machine-list-mechanical',
  electrical: 'machine-list-electrical',
  thermal: 'machine-list-thermal',
  aerospace: 'machine-list-aerospace',
  engines: 'machine-list-engines',
  advanced: 'machine-list-advanced',
  robotics: 'machine-list-robotics',
  thermodynamics: 'machine-list-thermodynamics',
  optics: 'machine-list-optics',
  acoustics: 'machine-list-acoustics',
  environmental: 'machine-list-environmental',
  materials: 'machine-list-materials',
  quantum: 'machine-list-quantum',
  civil: 'machine-list-civil',
  marine: 'machine-list-marine',
  petrochemical: 'machine-list-petrochemical',
  biology: 'machine-list-biology',
  organic_chemistry: 'machine-list-organic_chemistry',
  synthetic_biology: 'machine-list-synthetic_biology',
  genetics: 'machine-list-genetics',
  immunology: 'machine-list-immunology',
  biochemistry: 'machine-list-biochemistry',
  chemistry: 'machine-list-chemistry',
  neuroscience: 'machine-list-neuroscience',
  biotechnology: 'machine-list-biotechnology',
  marine_biology: 'machine-list-marine_biology',
  ecology: 'machine-list-ecology',
  paleontology: 'machine-list-paleontology'
};

// STATE
const state = {
  currentMode: 'explore',
  currentMachine: null,
  currentMachineData: null,
  selectedPartIndex: -1,
  damagedParts: new Set(),
  assemblyStep: 0,
  quizState: { score: 0, streak: 0, current: 0, total: 0, difficulty: 'basic', questions: [], answered: false },
  explodeFactor: 0,
  animSpeed: 1,
  wireframe: false,
  showLabels: false,
  animating: true,
};

// THREE.JS SETUP
let scene, camera, renderer, controls, raycaster, mouse;
let machineGroup = null;
let partMeshes = [];      // Array of { mesh, originalMat, partData }
let clock = new THREE.Clock();
let currentMixer = null;

function initThree() {
  const canvas = document.getElementById('three-canvas');
  const viewport = document.getElementById('viewport');

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0e1a, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(50, viewport.clientWidth / viewport.clientHeight, 0.1, 200);
  camera.position.set(6, 4, 8);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Ultra High Quality Environment Map
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1;
  controls.maxDistance = 30;
  controls.target.set(0, 0, 0);

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Lighting
  setupLighting();

  // Grid + Ground
  setupEnvironment();

  // Events
  window.addEventListener('resize', onResize);
  canvas.addEventListener('click', onCanvasClick);
  canvas.addEventListener('mousemove', onCanvasMouseMove);

  updateLoader(70, 'Setting up scene...');
}

function setupLighting() {
  // Ambient
  const ambient = new THREE.AmbientLight(0x334466, 0.6);
  scene.add(ambient);

  // Hemisphere
  const hemi = new THREE.HemisphereLight(0x88aacc, 0x333355, 0.5);
  scene.add(hemi);

  // Main directional
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(8, 12, 6);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  dir.shadow.camera.near = 0.5;
  dir.shadow.camera.far = 50;
  dir.shadow.camera.left = -15;
  dir.shadow.camera.right = 15;
  dir.shadow.camera.top = 15;
  dir.shadow.camera.bottom = -15;
  scene.add(dir);

  // Fill light
  const fill = new THREE.DirectionalLight(0x6688cc, 0.4);
  fill.position.set(-5, 3, -5);
  scene.add(fill);

  // Rim light
  const rim = new THREE.DirectionalLight(0x88aaff, 0.3);
  rim.position.set(-3, 8, -8);
  scene.add(rim);
}

function setupEnvironment() {
  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(60, 60);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x0d1117, metalness: 0.3, roughness: 0.8
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  ground.userData.isGround = true;
  scene.add(ground);

  // Grid
  const grid = new THREE.GridHelper(40, 80, 0x1a2744, 0x111827);
  grid.material.opacity = 0.3;
  grid.material.transparent = true;
  scene.add(grid);
}

// LOADING
function updateLoader(percent, status) {
  const fill = document.getElementById('loader-fill');
  const statusEl = document.getElementById('loader-status');
  if (fill) fill.style.width = percent + '%';
  if (statusEl) statusEl.textContent = status;
}

function hideLoader() {
  const ls = document.getElementById('loading-screen');
  if (ls) {
      ls.classList.add('fade-out');
      document.getElementById('app').classList.remove('hidden');
      onResize();
      setTimeout(() => ls.style.display = 'none', 800);
  }
}

// MACHINE LOADING
// Garbage collection helper
function disposeNode(node) {
  if (node.geometry) {
    node.geometry.dispose();
  }
  if (node.material) {
    if (Array.isArray(node.material)) {
      node.material.forEach(m => m.dispose());
    } else {
      node.material.dispose();
    }
  }
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      disposeNode(node.children[i]);
    }
  }
}

async function loadMachine(machineEntry) {
  // Clear previous and aggressively GC
  if (machineGroup) {
    disposeNode(machineGroup);
    scene.remove(machineGroup);
    machineGroup = null;
  }
  partMeshes = [];
  state.selectedPartIndex = -1;
  state.damagedParts.clear();
  state.assemblyStep = 0;
  state.explodeFactor = 0;

  // Create machine
  let createFn = machineEntry.create;
  if (machineEntry.importPath) {
    const mod = await import(machineEntry.importPath);
    createFn = mod.createMachine || mod[machineEntry.importName];
  }
  const data = createFn(THREE, machineEntry.id);
  // Auto-generate parts array if missing (for batch-created machines)
  if (!data.parts) {
    data.parts = [];
    data.group.children.forEach((child, i) => {
      data.parts.push({ name: child.name || ('Part ' + (i+1)), material: 'Composite', function: 'Component' });
    });
  }
  if (!data.description) data.description = machineEntry.name + ' - Interactive 3D Model';
  state.currentMachine = machineEntry;
  state.currentMachineData = data;

  machineGroup = data.group;
  machineGroup.position.set(0, 0, 0);
  scene.add(machineGroup);

  // Gather all part meshes
  data.parts.forEach((partData, idx) => {
    const mesh = machineGroup.children[idx];
    if (mesh) {
      mesh.userData.partIndex = idx;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // Store original materials recursively
      const origMats = [];
      mesh.traverse(child => {
        if (child.isMesh) {
          origMats.push({ mesh: child, mat: child.material.clone() });
        }
      });
      partMeshes.push({ group: mesh, originalMats: origMats, partData, idx });
    }
  });

  // Center camera on machine
  const box = new THREE.Box3().setFromObject(machineGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const dist = maxDim * 2.5;

  controls.target.copy(center);
  camera.position.set(center.x + dist * 0.6, center.y + dist * 0.4, center.z + dist * 0.7);
  controls.update();

  // Update UI
  updateMachineUI(machineEntry, data);
  updatePartsList(data);

  // Set up AnimationMixer for batch machines with animationClips
  if (currentMixer) { currentMixer.stopAllAction(); currentMixer = null; }
  if (data.animationClips && data.animationClips.length > 0) {
    currentMixer = new THREE.AnimationMixer(machineGroup);
    data.animationClips.forEach(clip => {
      const action = currentMixer.clipAction(clip);
      action.play();
    });
  }

  // Show hint
  const hint = document.getElementById('viewport-hint');
  if (hint) {
    hint.classList.remove('hidden');
    setTimeout(() => hint.classList.add('hidden'), 4000);
  }

  // Update stat counter
  const statMachines = document.getElementById('stat-machines'); if (statMachines) statMachines.textContent = MACHINES.length;
  const statParts = document.getElementById('stat-parts');
  if (statParts) statParts.textContent = data.parts.length;
}

// UI UPDATES
function updateMachineUI(entry, data) {
  document.getElementById('machine-title').textContent = entry.name;
  document.getElementById('machine-description').textContent = data.description;
  const badge = document.getElementById('machine-category-badge');
  if (badge) {
      badge.textContent = entry.category.toUpperCase();
      badge.classList.remove('hidden');
  }
}

function updatePartsList(data) {
  const ul = document.getElementById('parts-list-ul');
  if (!ul) return;
  ul.innerHTML = '';
  data.parts.forEach((p, i) => {
    const li = document.createElement('li');
    const color = partMeshes[i] ? getPartColor(i) : '#888';
    li.innerHTML = `<span class="part-dot" style="background:${color}"></span>${p.name}`;
    li.addEventListener('click', () => selectPart(i));
    ul.appendChild(li);
  });
}

function getPartColor(idx) {
  if (!partMeshes[idx]) return '#888';
  const mats = partMeshes[idx].originalMats;
  if (mats.length > 0 && mats[0].mat.color) {
    return '#' + mats[0].mat.color.getHexString();
  }
  return '#888';
}

function selectPart(idx) {
  state.selectedPartIndex = idx;
  const data = state.currentMachineData;
  if (!data) return;

  const part = data.parts[idx];

  // Update info panel
  const info = document.getElementById('part-info');
  if (info) {
      info.classList.remove('hidden');
      document.getElementById('part-name').textContent = part.name;
      document.getElementById('part-material').textContent = part.material || 'N/A';
      document.getElementById('part-function').textContent = part.function || 'N/A';
      document.getElementById('part-connections').textContent = (part.connections || []).join(', ') || 'None';
      document.getElementById('part-failure').textContent = part.failureEffect || 'N/A';
      document.getElementById('part-description').textContent = part.description || '';
  }

  // Highlight in list
  const items = document.querySelectorAll('#parts-list-ul li');
  items.forEach((li, i) => li.classList.toggle('active', i === idx));

  // Apply transparency to other parts
  applyPartHighlight(idx);

  // Handle mode-specific clicks
  if (state.currentMode === 'damage') {
    toggleDamage(idx);
  } else if (state.currentMode === 'assemble') {
    handleAssemblyClick(idx);
  }
}

function applyPartHighlight(activeIdx) {
  partMeshes.forEach(({ group, originalMats, idx }) => {
    group.traverse(child => {
      if (child.isMesh) {
        if (idx === activeIdx) {
          // Restore original material
          const orig = originalMats.find(o => o.mesh === child);
          if (orig) child.material = orig.mat.clone();
          // Add emissive glow
          if (child.material.emissive) {
            child.material.emissive.set(0x38bdf8);
            child.material.emissiveIntensity = 0.15;
          }
        } else {
          // Make transparent
          child.material = ghostMaterial.clone();
        }
      }
    });
  });
}

function clearHighlight() {
  state.selectedPartIndex = -1;
  const info = document.getElementById('part-info');
  if (info) info.classList.add('hidden');
  const items = document.querySelectorAll('#parts-list-ul li');
  items.forEach(li => li.classList.remove('active'));

  // Restore all materials
  partMeshes.forEach(({ group, originalMats }) => {
    group.traverse(child => {
      if (child.isMesh) {
        const orig = originalMats.find(o => o.mesh === child);
        if (orig) child.material = orig.mat.clone();
      }
    });
  });

  // Re-apply damage visuals if in damage mode
  if (state.currentMode === 'damage') {
    applyDamageVisuals();
  }
}

// RAYCASTING / INTERACTION
function onCanvasClick(e) {
  if (!machineGroup) return;

  const viewport = document.getElementById('viewport');
  const rect = viewport.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const allMeshes = [];
  machineGroup.traverse(c => { if (c.isMesh && !c.userData.isGround) allMeshes.push(c); });

  const intersects = raycaster.intersectObjects(allMeshes, false);
  if (intersects.length > 0) {
    // Find which part group this mesh belongs to
    let obj = intersects[0].object;
    while (obj.parent && obj.parent !== machineGroup) obj = obj.parent;
    const idx = machineGroup.children.indexOf(obj);
    if (idx >= 0) {
      selectPart(idx);
    }
  } else {
    clearHighlight();
  }
}

function onCanvasMouseMove(e) {
  if (!machineGroup) return;

  const viewport = document.getElementById('viewport');
  const rect = viewport.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const allMeshes = [];
  machineGroup.traverse(c => { if (c.isMesh) allMeshes.push(c); });

  const intersects = raycaster.intersectObjects(allMeshes, false);
  const tooltip = document.getElementById('part-tooltip');

  if (intersects.length > 0) {
    let obj = intersects[0].object;
    while (obj.parent && obj.parent !== machineGroup) obj = obj.parent;
    const idx = machineGroup.children.indexOf(obj);
    if (idx >= 0 && state.currentMachineData) {
      const part = state.currentMachineData.parts[idx];
      tooltip.textContent = part.name;
      tooltip.style.left = e.clientX + 'px';
      tooltip.style.top = (e.clientY - rect.top) + 'px';
      tooltip.classList.remove('hidden');
      document.getElementById('three-canvas').style.cursor = 'pointer';
      return;
    }
  }
  tooltip.classList.add('hidden');
  document.getElementById('three-canvas').style.cursor = 'grab';
}

// MODE MANAGEMENT
function setMode(mode) {
  state.currentMode = mode;

  // Update toolbar buttons
  document.querySelectorAll('.mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.mode === mode));

  // Show/hide panels
  document.querySelectorAll('.panel-section').forEach(p => p.classList.add('hidden'));
  const panelMap = {
    explore: 'panel-explore',
    explode: 'panel-explore',
    animate: 'panel-explore',
    damage: 'panel-damage',
    assemble: 'panel-assemble',
    quiz: 'panel-quiz',
  };
  const target = document.getElementById(panelMap[mode]);
  if (target) target.classList.remove('hidden');

  // Show/hide controls
  const speedControl = document.getElementById('speed-control');
  if (speedControl) speedControl.classList.toggle('hidden', mode !== 'animate');
  const explodeControl = document.getElementById('explode-control');
  if (explodeControl) explodeControl.classList.toggle('hidden', mode !== 'explode');

  // Reset visuals
  clearHighlight();

  // Mode-specific init
  if (mode === 'explode') {
    const slider = document.getElementById('explode-slider');
    if (slider) slider.value = state.explodeFactor;
  }
  if (mode === 'damage') {
    state.damagedParts.clear();
    updateDamageUI();
    generatePermutations();
  }
  if (mode === 'assemble') {
    initAssemblyMode();
  }
  if (mode === 'quiz') {
    initQuizPanel();
  }
  if (mode !== 'explode') {
    state.explodeFactor = 0;
    applyExplode(0);
  }
}

// EXPLODE MODE
function applyExplode(factor) {
  if (!state.currentMachineData) return;
  const data = state.currentMachineData;

  partMeshes.forEach(({ group, idx }) => {
    const ep = data.parts[idx].explodedPosition;
    const op = data.parts[idx].originalPosition || new THREE.Vector3();
    if (ep) {
      group.position.lerpVectors(
        new THREE.Vector3(op.x || 0, op.y || 0, op.z || 0),
        new THREE.Vector3(ep.x, ep.y, ep.z),
        factor
      );
    }
  });
}

// DAMAGE SIMULATION
function toggleDamage(idx) {
  if (state.damagedParts.has(idx)) {
    state.damagedParts.delete(idx);
  } else if (state.damagedParts.size < 2) {
    state.damagedParts.add(idx);
  }
  updateDamageUI();
  applyDamageVisuals();
}

function applyDamageVisuals() {
  partMeshes.forEach(({ group, originalMats, idx }) => {
    group.traverse(child => {
      if (child.isMesh) {
        if (state.damagedParts.has(idx)) {
          child.material = damagedOverlay.clone();
        } else {
          const orig = originalMats.find(o => o.mesh === child);
          if (orig) child.material = orig.mat.clone();
        }
      }
    });
  });

  // Also highlight cascade-affected parts
  if (state.currentMachineData) {
    const cascadeAffected = getCascadeAffected();
    partMeshes.forEach(({ group, idx }) => {
      if (cascadeAffected.has(idx) && !state.damagedParts.has(idx)) {
        group.traverse(child => {
          if (child.isMesh) {
            child.material = child.material.clone();
            if (child.material.emissive) {
              child.material.emissive.set(0xffa500);
              child.material.emissiveIntensity = 0.4;
            }
            child.material.transparent = true;
            child.material.opacity = 0.7;
          }
        });
      }
    });
  }
}

function getCascadeAffected() {
  const affected = new Set();
  if (!state.currentMachineData) return affected;
  const parts = state.currentMachineData.parts;

  state.damagedParts.forEach(dmgIdx => {
    const dmgPart = parts[dmgIdx];
    if (dmgPart.cascadeFailures) {
      dmgPart.cascadeFailures.forEach(name => {
        const idx = parts.findIndex(p => p.name === name);
        if (idx >= 0) affected.add(idx);
      });
    }
  });
  return affected;
}

function updateDamageUI() {
  const container = document.getElementById('damaged-parts-list');
  const analysisDiv = document.getElementById('damage-analysis');
  const cascadeDiv = document.getElementById('cascade-result');

  if (!container || !state.currentMachineData) return;
  const parts = state.currentMachineData.parts;

  // Show damaged tags
  container.innerHTML = '';
  state.damagedParts.forEach(idx => {
    const tag = document.createElement('span');
    tag.className = 'damaged-tag';
    tag.textContent = ' ' + parts[idx].name;
    container.appendChild(tag);
  });

  // Show cascade analysis
  if (state.damagedParts.size > 0 && analysisDiv) {
    analysisDiv.classList.remove('hidden');
    cascadeDiv.innerHTML = '';

    state.damagedParts.forEach(idx => {
      const part = parts[idx];
      const item = document.createElement('div');
      item.className = 'cascade-item';
      item.innerHTML = `<span class="cascade-arrow"></span>
        <span class="cascade-text"><strong>${part.name}</strong> failure: ${part.failureEffect || 'System degradation'}</span>`;
      cascadeDiv.appendChild(item);

      if (part.cascadeFailures) {
        part.cascadeFailures.forEach(name => {
          const cascadePart = parts.find(p => p.name === name);
          const sub = document.createElement('div');
          sub.className = 'cascade-item';
          sub.innerHTML = `<span class="cascade-arrow"></span>
            <span class="cascade-text">Cascades to <strong>${name}</strong>: ${cascadePart?.failureEffect || 'Performance degraded'}</span>`;
          cascadeDiv.appendChild(sub);
        });
      }
    });
  } else if (analysisDiv) {
    analysisDiv.classList.add('hidden');
  }
}

function generatePermutations() {
  const permDiv = document.getElementById('permutation-list');
  if (!permDiv) return;
  if (!state.currentMachineData) { permDiv.innerHTML = '<p style="color:var(--text-muted);font-size:0.8rem;">Load a machine first</p>'; return; }
  const parts = state.currentMachineData.parts;
  const activePerm = document.querySelector('.perm-controls .active');
  const permType = activePerm ? activePerm.dataset.perm : 'single';

  permDiv.innerHTML = '';

  if (permType === 'single') {
    parts.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'perm-item';
      div.innerHTML = `<div class="perm-parts"> ${p.name}</div><div class="perm-effect">${p.failureEffect || 'System affected'}</div>`;
      div.addEventListener('click', () => {
        state.damagedParts.clear();
        state.damagedParts.add(i);
        updateDamageUI();
        applyDamageVisuals();
      });
      permDiv.appendChild(div);
    });
  } else {
    // Double combinations
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const div = document.createElement('div');
        div.className = 'perm-item';
        const combinedEffect = `${parts[i].failureEffect || 'Degraded'} + ${parts[j].failureEffect || 'Degraded'}`;
        div.innerHTML = `<div class="perm-parts"> ${parts[j].name}</div><div class="perm-effect">${combinedEffect}</div>`;
        div.addEventListener('click', () => {
          state.damagedParts.clear();
          state.damagedParts.add(i);
          state.damagedParts.add(j);
          updateDamageUI();
          applyDamageVisuals();
        });
        permDiv.appendChild(div);
      }
    }
  }
}

// ASSEMBLY MODE
function initAssemblyMode() {
  if (!state.currentMachineData) return;
  state.assemblyStep = 0;
  const parts = state.currentMachineData.parts;
  const sorted = [...parts].sort((a, b) => (a.assemblyOrder || 0) - (b.assemblyOrder || 0));

  // Hide all parts initially
  partMeshes.forEach(({ group }) => group.visible = false);

  updateAssemblyUI(sorted);
}

function handleAssemblyClick(clickedIdx) {
  if (!state.currentMachineData) return;
  const parts = state.currentMachineData.parts;
  const sorted = [...parts].sort((a, b) => (a.assemblyOrder || 0) - (b.assemblyOrder || 0));

  if (state.assemblyStep >= sorted.length) return;

  const expected = sorted[state.assemblyStep];
  const expectedIdx = parts.indexOf(expected);

  if (clickedIdx === expectedIdx) {
    // Correct!
    partMeshes[clickedIdx].group.visible = true;
    // Restore materials for this part
    partMeshes[clickedIdx].group.traverse(child => {
      if (child.isMesh) {
        const orig = partMeshes[clickedIdx].originalMats.find(o => o.mesh === child);
        if (orig) child.material = orig.mat.clone();
      }
    });
    state.assemblyStep++;
    updateAssemblyUI(sorted);
  }

  // Show all parts as ghosted so user can click correct one
  partMeshes.forEach(({ group, idx }) => {
    if (!group.visible) {
      group.visible = true;
      group.traverse(child => {
        if (child.isMesh) child.material = ghostMaterial.clone();
      });
    }
  });
}

function updateAssemblyUI(sorted) {
  const total = sorted.length;
  const step = state.assemblyStep;

  const fill = document.getElementById('assembly-fill');
  if (fill) fill.style.width = `${(step / total) * 100}%`;
  const counter = document.getElementById('assembly-step-counter');
  if (counter) counter.textContent = `Step ${step} / ${total}`;

  const instruction = document.getElementById('assembly-instruction');
  if (instruction) {
    if (step < total) {
      instruction.innerHTML = `<p>Click on: <strong style="color:var(--accent)">${sorted[step].name}</strong></p>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">${sorted[step].description || ''}</p>`;
    } else {
      instruction.innerHTML = `<p style="color:var(--success)"> Assembly Complete! All ${total} parts assembled correctly.</p>`;
    }
  }

  // Update step list
  const list = document.getElementById('assembly-order-list');
  if (list) {
      list.innerHTML = '';
      sorted.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = `assembly-step ${i < step ? 'completed' : ''} ${i === step ? 'current' : ''}`;
        div.innerHTML = `<span class="step-num">${i < step ? '' : i + 1}</span><span class="step-name">${p.name}</span>`;
        list.appendChild(div);
      });
  }
}

// QUIZ MODE
function initQuizPanel() {
  state.quizState.score = 0;
  state.quizState.streak = 0;
  state.quizState.current = 0;
  updateQuizScoreUI();
  const body = document.getElementById('quiz-body');
  if (body) body.classList.add('hidden');
  const startBtn = document.getElementById('btn-start-quiz');
  if (startBtn) startBtn.classList.remove('hidden');
}

function startQuiz() {
  if (!state.currentMachineData || !state.currentMachineData.quizQuestions) return;

  const diff = state.quizState.difficulty;
  let questions = state.currentMachineData.quizQuestions.filter(q => q.difficulty === diff);
  if (questions.length === 0) questions = state.currentMachineData.quizQuestions;

  // Shuffle
  questions = questions.sort(() => Math.random() - 0.5);
  state.quizState.questions = questions;
  state.quizState.total = questions.length;
  state.quizState.current = 0;
  state.quizState.score = 0;
  state.quizState.streak = 0;

  document.getElementById('btn-start-quiz').classList.add('hidden');
  document.getElementById('quiz-body').classList.remove('hidden');
  showQuestion();
}

function showQuestion() {
  const q = state.quizState.questions[state.quizState.current];
  if (!q) return;

  state.quizState.answered = false;
  document.getElementById('quiz-question-text').textContent = q.question;
  document.getElementById('quiz-feedback').classList.add('hidden');
  document.getElementById('btn-next-question').classList.add('hidden');

  const optList = document.getElementById('quiz-options-list');
  optList.innerHTML = '';
  const letters = 'ABCDEFGH';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-option';
    div.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    div.addEventListener('click', () => answerQuiz(i));
    optList.appendChild(div);
  });

  updateQuizScoreUI();
}

function answerQuiz(chosenIdx) {
  if (state.quizState.answered) return;
  state.quizState.answered = true;

  const q = state.quizState.questions[state.quizState.current];
  const options = document.querySelectorAll('.quiz-option');
  const feedback = document.getElementById('quiz-feedback');

  options.forEach((opt, i) => {
    if (i === q.correct) opt.classList.add('correct');
    if (i === chosenIdx && i !== q.correct) opt.classList.add('wrong');
  });

  if (chosenIdx === q.correct) {
    state.quizState.score++;
    state.quizState.streak++;
    feedback.textContent = ' Correct! ' + (q.explanation || '');
    feedback.className = 'correct-fb';
  } else {
    state.quizState.streak = 0;
    feedback.textContent = ' Incorrect. ' + (q.explanation || '');
    feedback.className = 'wrong-fb';
  }
  feedback.classList.remove('hidden');
  document.getElementById('btn-next-question').classList.remove('hidden');
  updateQuizScoreUI();
}

function nextQuestion() {
  state.quizState.current++;
  if (state.quizState.current < state.quizState.total) {
    showQuestion();
  } else {
    document.getElementById('quiz-question-text').textContent = `Quiz Complete! Score: ${state.quizState.score}/${state.quizState.total}`;
    document.getElementById('quiz-options-list').innerHTML = '';
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('btn-next-question').classList.add('hidden');
    document.getElementById('btn-start-quiz').classList.remove('hidden');
    document.getElementById('btn-start-quiz').textContent = 'Retry Quiz';
  }
}

function updateQuizScoreUI() {
  document.getElementById('score-value').textContent = state.quizState.score;
  document.getElementById('streak-value').textContent = state.quizState.streak;
  document.getElementById('quiz-progress').textContent = `${state.quizState.current + (state.quizState.answered ? 1 : 0)}/${state.quizState.total}`;
}

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  controls.update();

  // Tick AnimationMixer for batch machines
  if (currentMixer) currentMixer.update(dt * state.animSpeed);

  // Animate machine parts (legacy callback)
  if (state.currentMode === 'animate' && state.currentMachineData && state.currentMachineData.animate) {
    state.currentMachineData.animate(elapsed, state.animSpeed, partMeshes);
  }

  renderer.render(scene, camera);
}

// EVENT HANDLERS
function onResize() {
  const viewport = document.getElementById('viewport');
  if(!viewport) return;
  camera.aspect = viewport.clientWidth / viewport.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(viewport.clientWidth, viewport.clientHeight);
}

function setupUI() {
  const sidebarEl = document.getElementById("sidebar");
  const createdSections = {};

  function getOrCreateContainer(cat) {
    const mapId = CATEGORY_MAP[cat] || ("machine-list-" + cat);
    const existing = document.getElementById(mapId);
    if (existing) return existing;
    if (createdSections[cat]) return createdSections[cat];
    if (!sidebarEl) return null;
    const label = document.createElement("div");
    label.className = "category-label";
    label.textContent = cat.replace(/_/g, " ").toUpperCase();
    const div = document.createElement("div");
    div.id = mapId;
    div.className = "machine-list";
    const footer = sidebarEl.querySelector(".sidebar-footer");
    if (footer) { sidebarEl.insertBefore(label, footer); sidebarEl.insertBefore(div, footer); }
    else { sidebarEl.appendChild(label); sidebarEl.appendChild(div); }
    createdSections[cat] = div;
    return div;
  }

  const params = new URLSearchParams(window.location.search);
  let filterCat = params.get('category');
  if (!filterCat) {
      const path = window.location.pathname.split('/').pop().replace('.html', '');
      if (path && path !== 'index' && path !== 'simulator') {
          filterCat = path;
      }
  }

  MACHINES.forEach(m => {
    if (filterCat && m.category !== filterCat) return;
    const container = getOrCreateContainer(m.category);
    if (!container) return;
    const btn = document.createElement("button");
    btn.className = "machine-btn";
    btn.dataset.id = m.id;
    btn.innerHTML = `<span class="m-icon">${m.icon}</span><span class="m-name">${m.name}</span>`;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".machine-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadMachine(m);
      if (window.innerWidth <= 900) {
          document.getElementById("sidebar").classList.remove("mobile-open");
      }
    });
    container.appendChild(btn);
  });

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
      setMode(b.dataset.mode);
      // On mobile, opening a mode like 'explore' or 'damage' might want to show info panel
      if (window.innerWidth <= 900) {
          document.getElementById('info-panel').classList.add('mobile-open');
          document.getElementById('sidebar').classList.remove('mobile-open');
      }
    });
  });

  // Mobile Toggles
  const toggleSidebar = document.getElementById('btn-toggle-sidebar');
  const toggleInfo = document.getElementById('btn-toggle-info');
  const sidebar = document.getElementById('sidebar');
  const infoPanel = document.getElementById('info-panel');

  if (toggleSidebar && sidebar) {
    toggleSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      infoPanel.classList.remove('mobile-open');
    });
  }

  if (toggleInfo && infoPanel) {
    toggleInfo.addEventListener('click', () => {
      infoPanel.classList.toggle('mobile-open');
      sidebar.classList.remove('mobile-open');
    });
  }

  // Toolbar buttons
  document.getElementById('btn-reset-camera').addEventListener('click', () => {
    if (machineGroup) {
      const box = new THREE.Box3().setFromObject(machineGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      controls.target.copy(center);
      camera.position.set(center.x + maxDim * 1.5, center.y + maxDim, center.z + maxDim * 1.5);
    }
  });

  document.getElementById('btn-wireframe').addEventListener('click', () => {
    state.wireframe = !state.wireframe;
    document.getElementById('btn-wireframe').classList.toggle('active', state.wireframe);
    if (machineGroup) {
      machineGroup.traverse(child => {
        if (child.isMesh) child.material.wireframe = state.wireframe;
      });
    }
  });

  document.getElementById('btn-fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.getElementById('btn-labels').addEventListener('click', () => {
    state.showLabels = !state.showLabels;
    document.getElementById('btn-labels').classList.toggle('active', state.showLabels);
  });

  // Explode slider
  document.getElementById('explode-slider').addEventListener('input', (e) => {
    state.explodeFactor = parseFloat(e.target.value);
    document.getElementById('explode-value').textContent = Math.round(state.explodeFactor * 100) + '%';
    applyExplode(state.explodeFactor);
  });

  // Speed slider
  document.getElementById('speed-slider').addEventListener('input', (e) => {
    state.animSpeed = parseFloat(e.target.value);
    document.getElementById('speed-value').textContent = state.animSpeed.toFixed(1) + 'x';
  });

  // Search
  document.getElementById('machine-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.machine-btn').forEach(btn => {
      const name = btn.querySelector('.m-name').textContent.toLowerCase();
      btn.style.display = name.includes(q) ? '' : 'none';
    });
  });

  // Damage permutation buttons
  document.querySelectorAll('.perm-controls .btn-sm').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.perm-controls .btn-sm').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      generatePermutations();
    });
  });

  // Damage clear
  document.getElementById('btn-clear-damage').addEventListener('click', () => {
    state.damagedParts.clear();
    updateDamageUI();
    clearHighlight();
  });

  // Assembly reset
  document.getElementById('btn-reset-assembly').addEventListener('click', () => {
    initAssemblyMode();
  });

  // Quiz buttons
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-next-question').addEventListener('click', nextQuestion);

  document.querySelectorAll('.diff-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.quizState.difficulty = b.dataset.diff;
    });
  });
}

// INIT
async function init() {
  updateLoader(20, 'Loading Three.js...');
  await new Promise(r => setTimeout(r, 200));

  if(document.getElementById('portal-grid')) { hideLoader(); return; }
  updateLoader(40, 'Initializing 3D engine...');
  initThree();

    updateLoader(80, 'Setting up interface...');
  try { await loadCustomModels(MACHINES); } catch(e) { console.warn('Chatbot error:', e); }
  try { initChatbot(); } catch(e) { console.warn('Chatbot UI error:', e); }
  setupUI();

  updateLoader(90, 'Loading machines...');
  await new Promise(r => setTimeout(r, 300));

  updateLoader(100, 'Ready!');
  await new Promise(r => setTimeout(r, 500));

  hideLoader();
  animate();

  // Auto-load first machine
  const firstBtn = document.querySelector('.machine-btn');
  if (firstBtn) firstBtn.click();
}

init().catch(err => { console.error('EngiSim init failed:', err); const s = document.getElementById('loader-status'); if (s) s.textContent = 'Error: ' + err.message; });
























































































