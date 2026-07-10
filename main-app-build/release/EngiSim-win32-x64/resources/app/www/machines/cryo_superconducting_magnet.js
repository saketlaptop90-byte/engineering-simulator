import { chrome, titanium, wireCoil, insulation, glass, blueAccent } from '../utils/materials.js';

export function createSuperconductingMagnetDewar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer Vacuum Chamber (OVC)
    const ovcGeo = new THREE.CylinderGeometry(3, 3, 6, 32);
    const ovc = new THREE.Mesh(ovcGeo, titanium);
    ovc.position.y = 3;
    group.add(ovc);

    // Radiation Shield
    const shieldGeo = new THREE.CylinderGeometry(2.5, 2.5, 5, 32);
    const shield = new THREE.Mesh(shieldGeo, chrome);
    shield.position.y = 3;
    group.add(shield);

    // Liquid Helium Vessel
    const vesselGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const vessel = new THREE.Mesh(vesselGeo, glass);
    vessel.position.y = 3;
    group.add(vessel);

    // Superconducting Coil
    const coilGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 64);
    const coil1 = new THREE.Mesh(coilGeo, wireCoil);
    coil1.position.y = 2.5;
    coil1.rotation.x = Math.PI / 2;
    group.add(coil1);

    const coil2 = new THREE.Mesh(coilGeo, wireCoil);
    coil2.position.y = 3.5;
    coil2.rotation.x = Math.PI / 2;
    group.add(coil2);

    // Magnetic Field Lines (Visualized)
    const fieldGroup = new THREE.Group();
    fieldGroup.position.y = 3;
    group.add(fieldGroup);

    const lineGeo = new THREE.TorusGeometry(2, 0.05, 8, 32);
    const lines = [];
    for (let i = 0; i < 5; i++) {
        const line = new THREE.Mesh(lineGeo, blueAccent);
        line.rotation.x = Math.PI / 2;
        line.scale.set(1 + i * 0.2, 1 + i * 0.2, 1 + i * 0.5);
        fieldGroup.add(line);
        lines.push(line);
    }

    // Service Turret
    const turretGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 16);
    const turret = new THREE.Mesh(turretGeo, insulation);
    turret.position.set(0, 6.5, 0);
    group.add(turret);

    // Animations
    // 1. Pulsing Magnetic Field
    lines.forEach((line, index) => {
        const scaleTrack = new THREE.VectorKeyframeTrack(
            '.scale',
            [0, 1, 2],
            [
                line.scale.x, line.scale.y, line.scale.z,
                line.scale.x * 1.1, line.scale.y * 1.1, line.scale.z * 1.2,
                line.scale.x, line.scale.y, line.scale.z
            ]
        );
        const clipScaleOnly = new THREE.AnimationClip(`PulseFieldScale_${index}`, 2, [scaleTrack]);
        animationClips.push({ clip: clipScaleOnly, target: line });
    });

    // 2. Coil micro-vibration
    const vibTrack = new THREE.VectorKeyframeTrack(
        '.position',
        [0, 0.05, 0.1, 0.15],
        [
            0, 2.5, 0,
            0.02, 2.5, 0.02,
            -0.02, 2.5, -0.02,
            0, 2.5, 0
        ]
    );
    const vibClip = new THREE.AnimationClip('CoilVibration', 0.15, [vibTrack]);
    animationClips.push({ clip: vibClip, target: coil1 });
    animationClips.push({ clip: vibClip, target: coil2 });

    return { group, animationClips };
}
