import { steel, aluminum, plastic, redAccent, greenAccent } from '../utils/materials.js';

export function createTrafficSignalBox(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Concrete Base
    const baseGeom = new THREE.BoxGeometry(1.2, 0.2, 1);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.y = 0.1;
    group.add(base);

    // Cabinet
    const cabinetGeom = new THREE.BoxGeometry(1, 1.8, 0.8);
    const cabinet = new THREE.Mesh(cabinetGeom, aluminum);
    cabinet.position.y = 1.1;
    group.add(cabinet);

    // Door Pivot
    const doorPivot = new THREE.Group();
    doorPivot.position.set(0.5, 1.1, 0.4);
    doorPivot.name = 'DoorPivot';
    group.add(doorPivot);

    // Door
    const doorGeom = new THREE.BoxGeometry(0.05, 1.78, 0.78);
    const door = new THREE.Mesh(doorGeom, steel);
    door.position.set(-0.025, 0, -0.39);
    doorPivot.add(door);

    // Door Handle
    const handleGeom = new THREE.BoxGeometry(0.05, 0.3, 0.05);
    const handle = new THREE.Mesh(handleGeom, plastic);
    handle.position.set(0.05, 0, -0.7);
    door.add(handle);

    // Internal electronics Rack
    const rackGeom = new THREE.BoxGeometry(0.8, 1.6, 0.4);
    const rack = new THREE.Mesh(rackGeom, steel);
    rack.position.set(0, 1.1, 0.1);
    group.add(rack);

    // Controller Unit
    const controllerGeom = new THREE.BoxGeometry(0.7, 0.4, 0.3);
    const controller = new THREE.Mesh(controllerGeom, plastic);
    controller.position.set(0, 1.5, 0.2);
    group.add(controller);

    // Screen
    const screenGeom = new THREE.PlaneGeometry(0.3, 0.2);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00aa00, emissiveIntensity: 0.5 });
    const screen = new THREE.Mesh(screenGeom, screenMat);
    screen.position.set(-0.1, 1.5, 0.36);
    group.add(screen);

    // Lights
    const redLight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02), redAccent);
    redLight.rotation.x = Math.PI/2;
    redLight.position.set(0.2, 1.6, 0.36);
    redLight.name = 'RedLight';
    group.add(redLight);

    const greenLight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02), greenAccent);
    greenLight.rotation.x = Math.PI/2;
    greenLight.position.set(0.2, 1.4, 0.36);
    greenLight.name = 'GreenLight';
    group.add(greenLight);

    // Animation: Open Door, blink lights
    const doorTrack = new THREE.NumberKeyframeTrack(
        'DoorPivot.rotation[y]',
        [0, 1, 5, 6],
        [0, -Math.PI * 0.6, -Math.PI * 0.6, 0]
    );

    const redScaleTrack = new THREE.VectorKeyframeTrack(
        'RedLight.scale',
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
        [1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1]
    );
    const greenScaleTrack = new THREE.VectorKeyframeTrack(
        'GreenLight.scale',
        [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6],
        [1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5]
    );

    const clip = new THREE.AnimationClip('ControllerOperation', 6, [doorTrack, redScaleTrack, greenScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
