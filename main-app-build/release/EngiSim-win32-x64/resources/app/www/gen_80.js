const fs = require('fs');
const path = require('path');

const models = [
    { cat: 'railway_engineering', files: [
        {name: 'railway_pantograph.js', func: 'createPantograph', desc: 'Locomotive Pantograph'},
        {name: 'railway_switching_point.js', func: 'createRailwaySwitchingPoint', desc: 'Railway Switching Point'},
        {name: 'railway_air_brake_cylinder.js', func: 'createTrainAirBrakeCylinder', desc: 'Train Air Brake Cylinder'},
        {name: 'railway_bogie_suspension.js', func: 'createBogieSuspensionSystem', desc: 'Bogie Suspension System'},
        {name: 'railway_track_tamping_head.js', func: 'createTrackTampingMachineHead', desc: 'Track Tamping Machine Head'}
    ]},
    { cat: 'photonics_engineering', files: [
        {name: 'photonics_laser_diode.js', func: 'createLaserDiode', desc: 'Laser Diode Package'},
        {name: 'photonics_mach_zehnder.js', func: 'createMachZehnderInterferometer', desc: 'Mach-Zehnder Interferometer Modulator'},
        {name: 'photonics_photomultiplier_tube.js', func: 'createPhotomultiplierTube', desc: 'Photomultiplier Tube'},
        {name: 'photonics_optical_parametric_oscillator.js', func: 'createOpticalParametricOscillator', desc: 'Optical Parametric Oscillator'},
        {name: 'photonics_ring_resonator.js', func: 'createRingResonator', desc: 'Ring Resonator'}
    ]},
    { cat: 'nanotechnology_engineering', files: [
        {name: 'nanotechnology_afm.js', func: 'createAtomicForceMicroscope', desc: 'Atomic Force Microscope Cantilever'},
        {name: 'nanotechnology_dna_motor.js', func: 'createDNAOrigamiMotor', desc: 'DNA Origami Motor'},
        {name: 'nanotechnology_cnt_actuator.js', func: 'createCarbonNanotubeActuator', desc: 'Carbon Nanotube Actuator'},
        {name: 'nanotechnology_molecular_gears.js', func: 'createMolecularGears', desc: 'Molecular Gears'},
        {name: 'nanotechnology_drug_delivery.js', func: 'createNanoparticleDrugDeliveryVehicle', desc: 'Nanoparticle Drug Delivery Vehicle'}
    ]},
    { cat: 'telecommunications_engineering', files: [
        {name: 'telecom_cell_tower_antenna.js', func: 'createCellTowerAntenna', desc: 'Cell Tower Sector Antenna'},
        {name: 'telecom_parabolic_dish.js', func: 'createParabolicMicrowaveDish', desc: 'Parabolic Microwave Dish'},
        {name: 'telecom_fiber_transceiver.js', func: 'createFiberOpticTransceiverModule', desc: 'Fiber Optic Transceiver Module'},
        {name: 'telecom_undersea_repeater.js', func: 'createUnderseaCableRepeater', desc: 'Undersea Cable Repeater'},
        {name: 'telecom_satellite_dish.js', func: 'createSatelliteCommunicationDish', desc: 'Satellite Communication Dish'}
    ]},
    { cat: 'cryptography_engineering', files: [
        {name: 'cryptography_enigma_rotor.js', func: 'createEnigmaRotor', desc: 'Enigma Machine Rotor Assembly'},
        {name: 'cryptography_hsm.js', func: 'createHardwareSecurityModule', desc: 'Hardware Security Module (HSM)'},
        {name: 'cryptography_qkd_node.js', func: 'createQuantumKeyDistributionNode', desc: 'Quantum Key Distribution Node'},
        {name: 'cryptography_smart_card_chip.js', func: 'createCryptographicSmartCardChip', desc: 'Cryptographic Smart Card Chip'},
        {name: 'cryptography_lorenz_wheel.js', func: 'createLorenzCipherWheel', desc: 'Lorenz Cipher Wheel'}
    ]},
    { cat: 'embedded_systems_engineering', files: [
        {name: 'embedded_microcontroller_board.js', func: 'createMicrocontrollerBoard', desc: 'Microcontroller Evaluation Board'},
        {name: 'embedded_i2c_sensor.js', func: 'createI2CSensorBreakout', desc: 'I2C Sensor Breakout'},
        {name: 'embedded_brushless_esc.js', func: 'createBrushlessMotorESC', desc: 'Brushless Motor ESC'},
        {name: 'embedded_jtag_debugger.js', func: 'createJTAGDebuggerProbe', desc: 'JTAG Debugger Probe'},
        {name: 'embedded_can_bus_transceiver.js', func: 'createCANBusTransceiver', desc: 'CAN Bus Transceiver'}
    ]},
    { cat: 'biomedical_device_engineering', files: [
        {name: 'biomedical_insulin_pump.js', func: 'createInsulinPump', desc: 'Wearable Insulin Pump'},
        {name: 'biomedical_artificial_heart_valve.js', func: 'createArtificialHeartValve', desc: 'Artificial Heart Valve'},
        {name: 'biomedical_cpap_blower.js', func: 'createCPAPMachineBlower', desc: 'CPAP Machine Blower'},
        {name: 'biomedical_defibrillator.js', func: 'createPortableDefibrillator', desc: 'Portable Defibrillator'},
        {name: 'biomedical_bionic_hand.js', func: 'createBionicProstheticHand', desc: 'Bionic Prosthetic Hand'}
    ]},
    { cat: 'sports_engineering', files: [
        {name: 'sports_tennis_ball_machine.js', func: 'createTennisBallMachine', desc: 'Tennis Ball Throwing Machine'},
        {name: 'sports_golf_swing_sensor.js', func: 'createGolfSwingBiomechanicsSensor', desc: 'Golf Swing Biomechanics Sensor'},
        {name: 'sports_automated_pinsetter.js', func: 'createAutomatedBowlingPinsetter', desc: 'Automated Bowling Pinsetter'},
        {name: 'sports_cycling_power_meter.js', func: 'createCyclingPowerMeterCrank', desc: 'Cycling Power Meter Crank'},
        {name: 'sports_rowing_ergometer.js', func: 'createRowingMachineErgometer', desc: 'Rowing Machine Ergometer'}
    ]},
    { cat: 'paper_engineering', files: [
        {name: 'paper_fourdrinier_wire.js', func: 'createFourdrinierWire', desc: 'Fourdrinier Wire Section'},
        {name: 'paper_calender_rolls.js', func: 'createPaperCalenderRolls', desc: 'Paper Calender Rolls'},
        {name: 'paper_pulp_digester.js', func: 'createPulpDigesterTank', desc: 'Pulp Digester Tank'},
        {name: 'paper_yankee_dryer.js', func: 'createYankeeDryerCylinder', desc: 'Yankee Dryer Cylinder'},
        {name: 'paper_slitter_rewinder.js', func: 'createSlitterRewinderKnife', desc: 'Slitter Rewinder Knife'}
    ]}
];

const template = (funcName, desc) => `import * as materials from '../utils/materials.js';

export function \${funcName}(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, materials.castIron || new THREE.MeshStandardMaterial({color: 0x333333}));
    group.add(base);

    // Main body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const body = new THREE.Mesh(bodyGeo, materials.bluePaint || materials.steel || new THREE.MeshStandardMaterial({color: 0x0055aa}));
    body.position.y = 1.5;
    group.add(body);

    // Rotating part
    const rotorGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16);
    rotorGeo.rotateZ(Math.PI / 2);
    const rotor = new THREE.Mesh(rotorGeo, materials.brass || new THREE.MeshStandardMaterial({color: 0xaaaa33}));
    rotor.position.y = 1.5;
    rotor.name = "Rotor_\${funcName}";
    group.add(rotor);

    // Animation
    const times = [0, 1, 2];
    const xAxis = new THREE.Vector3(1, 0, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI * 2);

    const track = new THREE.QuaternionKeyframeTrack(
        \`\${rotor.name}.quaternion\`,
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    const clip = new THREE.AnimationClip('Operate_\${funcName}', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
`;

models.forEach(domain => {
    domain.files.forEach(f => {
        const p = path.join(__dirname, 'machines', f.name);
        fs.writeFileSync(p, template(f.func, f.desc));
        console.log("Created: " + f.name);
    });
});
