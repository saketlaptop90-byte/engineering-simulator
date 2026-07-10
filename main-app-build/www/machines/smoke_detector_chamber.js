import { whitePlastic, blackPlastic, redAccent, glass, ghostMaterial } from '../utils/materials.js';

export function createSmokeDetectorChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const casingGeom = new THREE.CylinderGeometry(2, 2, 0.8, 32);
    const casing = new THREE.Mesh(casingGeom, whitePlastic);
    casing.position.y = 0.4;
    group.add(casing);

    const labyrinthGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.6, 16);
    const labyrinth = new THREE.Mesh(labyrinthGeom, blackPlastic);
    labyrinth.position.y = 0.3;
    group.add(labyrinth);

    const ledGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const led = new THREE.Mesh(ledGeom, glass);
    led.position.set(0.8, 0.3, 0);
    group.add(led);

    const ledBeamGeom = new THREE.CylinderGeometry(0.02, 0.1, 1.5, 8);
    const ledBeam = new THREE.Mesh(ledBeamGeom, ghostMaterial);
    ledBeam.rotation.z = Math.PI / 2;
    ledBeam.position.set(0, 0.3, 0);
    group.add(ledBeam);

    const diodeGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const diode = new THREE.Mesh(diodeGeom, blackPlastic);
    diode.position.set(0, 0.3, 0.8);
    group.add(diode);

    const alarmGeom = new THREE.SphereGeometry(0.1, 16, 16);
    const alarmLED = new THREE.Mesh(alarmGeom, redAccent);
    alarmLED.position.set(1.5, 0.8, 0);
    alarmLED.name = "AlarmLED";
    group.add(alarmLED);

    const ledScale = new THREE.VectorKeyframeTrack('AlarmLED.scale', 
        [0, 0.5, 1, 1.5, 2], 
        [1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1]
    );
    const clip = new THREE.AnimationClip('DetectSmoke', 2, [ledScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
