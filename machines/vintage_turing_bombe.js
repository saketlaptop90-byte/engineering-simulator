import { wood, brass, copper, darkSteel, glass } from '../utils/materials.js';

export function createTuringBombe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main cabinet
    const cabinetGeom = new THREE.BoxGeometry(10, 15, 4);
    const cabinet = new THREE.Mesh(cabinetGeom, darkSteel);
    cabinet.position.y = 7.5;
    group.add(cabinet);

    // Front panel
    const panelGeom = new THREE.BoxGeometry(9, 12, 0.5);
    const panel = new THREE.Mesh(panelGeom, brass);
    panel.position.set(0, 8, 2.1);
    group.add(panel);

    // Rotors
    const rotors = [];
    const rotorGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 9; col++) {
            const rotorGroup = new THREE.Group();
            rotorGroup.position.set(-4 + col * 1.0, 13 - row * 2.0, 2.3);
            rotorGroup.name = `rotor_${row}_${col}`;

            const rotor = new THREE.Mesh(rotorGeom, copper);
            rotor.rotation.x = Math.PI / 2; // Face forward
            rotorGroup.add(rotor);

            // Add some markers on the rotor so spinning is visible
            const markerGeom = new THREE.BoxGeometry(0.9, 0.9, 0.45);
            const marker = new THREE.Mesh(markerGeom, darkSteel);
            rotorGroup.add(marker);

            group.add(rotorGroup);
            rotors.push(rotorGroup);
        }
    }

    // Wiring at the bottom
    for(let i = 0; i < 15; i++) {
        const start = new THREE.Vector3(-4 + Math.random() * 8, 4, 2.3);
        const mid = new THREE.Vector3(0, 3, 3.5);
        const end = new THREE.Vector3(-4 + Math.random() * 8, 2, 2.3);
        const wireCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const tubeGeom = new THREE.TubeGeometry(wireCurve, 10, 0.05, 8, false);
        const wire = new THREE.Mesh(tubeGeom, copper);
        group.add(wire);
    }

    // Animation: Rotors spinning
    const tracks = [];
    rotors.forEach((rotorGroup, index) => {
        const speed = 1 + (index % 3) * 0.5;
        const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
        const qMid = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * speed);
        const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2 * speed);
        
        const track = new THREE.QuaternionKeyframeTrack(
            `${rotorGroup.name}.quaternion`,
            [0, 1, 2],
            [...qStart.toArray(), ...qMid.toArray(), ...qEnd.toArray()]
        );
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('SpinRotors', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
