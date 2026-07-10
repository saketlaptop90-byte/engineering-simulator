import { metals, plastics, lights } from '../utils/materials.js';

export function createTrafficSignalControllerCabinet(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cabinet body
    const cabinetGeometry = new THREE.BoxGeometry(2, 3, 1.5);
    const cabinet = new THREE.Mesh(cabinetGeometry, metals?.brushedAluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    cabinet.position.y = 1.5;
    group.add(cabinet);

    // Door pivot
    const doorPivot = new THREE.Group();
    doorPivot.position.set(1, 1.5, 0.75);
    group.add(doorPivot);

    // Cabinet door
    const doorGeometry = new THREE.BoxGeometry(2, 3, 0.1);
    doorGeometry.translate(-1, 0, 0.05); // move pivot to edge
    const door = new THREE.Mesh(doorGeometry, metals?.brushedAluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    doorPivot.add(door);

    // Inside panel
    const panelGeometry = new THREE.PlaneGeometry(1.8, 2.8);
    const panel = new THREE.Mesh(panelGeometry, plastics?.grey || new THREE.MeshStandardMaterial({ color: 0x555555 }));
    panel.position.set(0, 1.5, 0.74);
    group.add(panel);

    // Blinking LED on panel
    const ledGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const led = new THREE.Mesh(ledGeometry, lights?.green || new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    led.position.set(-0.5, 2.5, 0.75);
    group.add(led);

    // Animation: Open door and blink LED
    const timesDoor = [0, 2, 4, 6];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    const valuesDoor = [...q1.toArray(), ...q2.toArray(), ...q2.toArray(), ...q1.toArray()];
    const doorTrack = new THREE.QuaternionKeyframeTrack(`${doorPivot.uuid}.quaternion`, timesDoor, valuesDoor);

    const timesLED = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];
    const valuesLED = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
    const ledTrack = new THREE.NumberKeyframeTrack(`${led.uuid}.material.opacity`, timesLED, valuesLED);
    led.material.transparent = true;

    const clip = new THREE.AnimationClip('MaintenanceCycle', 6, [doorTrack, ledTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
