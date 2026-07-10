import * as THREE from 'three';
import { aluminum, blackPlastic, rubber, darkSteel, blueAccent } from '../utils/materials.js';

export function createSegway(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // --- Base & Wheels ---
    const baseGeo = new THREE.BoxGeometry(1.5, 0.3, 1.0);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 0.6;
    group.add(base);

    const wheelGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32);
    wheelGeo.rotateX(Math.PI / 2);

    const leftWheel = new THREE.Mesh(wheelGeo, rubber);
    leftWheel.position.set(0.9, 0, 0);
    base.add(leftWheel);

    const leftWheelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.32, 16), aluminum);
    leftWheelHub.rotation.x = Math.PI / 2;
    leftWheel.add(leftWheelHub);

    const rightWheel = new THREE.Mesh(wheelGeo, rubber);
    rightWheel.position.set(-0.9, 0, 0);
    base.add(rightWheel);

    const rightWheelHub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.32, 16), aluminum);
    rightWheelHub.rotation.x = Math.PI / 2;
    rightWheel.add(rightWheelHub);

    // --- Stick & Handlebar ---
    const stickGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.0);
    const stick = new THREE.Mesh(stickGeo, aluminum);
    stick.position.set(0, 1.65, 0);
    base.add(stick);

    const displayGeo = new THREE.BoxGeometry(0.4, 0.4, 0.2);
    const display = new THREE.Mesh(displayGeo, blackPlastic);
    display.position.set(0, 1.5, 0.1);
    display.rotation.x = -Math.PI / 6;
    stick.add(display);

    const screenGeo = new THREE.PlaneGeometry(0.3, 0.3);
    const screen = new THREE.Mesh(screenGeo, blueAccent);
    screen.position.set(0, 0, 0.11);
    display.add(screen);

    const handleBarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2);
    handleBarGeo.rotateZ(Math.PI / 2);
    const handleBar = new THREE.Mesh(handleBarGeo, darkSteel);
    handleBar.position.set(0, 1.5, 0);
    stick.add(handleBar);

    const gripGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.3);
    gripGeo.rotateZ(Math.PI / 2);
    const leftGrip = new THREE.Mesh(gripGeo, rubber);
    leftGrip.position.set(0.5, 0, 0);
    handleBar.add(leftGrip);

    const rightGrip = new THREE.Mesh(gripGeo, rubber);
    rightGrip.position.set(-0.5, 0, 0);
    handleBar.add(rightGrip);

    // --- Animation (Balancing and Moving) ---
    const tracks = [];
    const duration = 4.0;
    const times = [0, 1, 2, 3, 4];

    // Balancing pitch
    const pitchAngles = [0, 0.1, 0, -0.1, 0];
    tracks.push(new THREE.NumberKeyframeTrack(`${base.uuid}.rotation[x]`, times, pitchAngles));

    // Wheels rolling
    const wheelRotations = [0, Math.PI, Math.PI * 2, Math.PI * 3, Math.PI * 4];
    tracks.push(new THREE.NumberKeyframeTrack(`${leftWheel.uuid}.rotation[x]`, times, wheelRotations));
    tracks.push(new THREE.NumberKeyframeTrack(`${rightWheel.uuid}.rotation[x]`, times, wheelRotations));

    // Base position moving slightly forward and back
    const zPositions = [0, 0.5, 0, -0.5, 0];
    tracks.push(new THREE.NumberKeyframeTrack(`${base.uuid}.position[z]`, times, zPositions));

    const balanceClip = new THREE.AnimationClip('Balance', duration, tracks);
    animationClips.push(balanceClip);

    return { group, animationClips };
}
