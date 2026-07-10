import { materials } from '../utils/materials.js';

export function createSoilStabilizer(THREE) {
    const group = new THREE.Group();
    group.name = "SoilStabilizerRig";
    const animationClips = [];

    // Base of the rig
    const baseGeo = new THREE.BoxGeometry(4, 1, 6);
    const base = new THREE.Mesh(baseGeo, materials.metal);
    base.position.y = 0.5;
    group.add(base);

    // Tracks
    const trackGeo = new THREE.BoxGeometry(1, 1.2, 7);
    const leftTrack = new THREE.Mesh(trackGeo, materials.darkMetal);
    leftTrack.position.set(-2.5, 0.6, 0);
    group.add(leftTrack);

    const rightTrack = new THREE.Mesh(trackGeo, materials.darkMetal);
    rightTrack.position.set(2.5, 0.6, 0);
    group.add(rightTrack);

    // Mast
    const mastGeo = new THREE.BoxGeometry(0.8, 10, 0.8);
    const mast = new THREE.Mesh(mastGeo, materials.yellowMetal);
    mast.position.set(0, 6, 2.5);
    group.add(mast);

    // Rotary head and auger
    const rotaryGroup = new THREE.Group();
    rotaryGroup.name = "RotaryGroup";
    rotaryGroup.position.set(0, 9, 3.2);
    
    const rotaryHeadGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const rotaryHead = new THREE.Mesh(rotaryHeadGeo, materials.metal);
    rotaryGroup.add(rotaryHead);

    const augerGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    const auger = new THREE.Mesh(augerGeo, materials.metal);
    auger.position.y = -4.5;
    rotaryGroup.add(auger);
    
    // Add auger blades
    const bladeGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16, 1, false, 0, Math.PI);
    const blade1 = new THREE.Mesh(bladeGeo, materials.metal);
    blade1.position.y = -4.5;
    rotaryGroup.add(blade1);

    group.add(rotaryGroup);

    // Animations: Auger drilling (rotation) and rotary head moving down
    const drillDuration = 5;
    
    // Auger rotation
    const rotationTimes = [0, drillDuration];
    const rotationValues = [0, -Math.PI * 20]; // 10 rotations
    const rotationTrack = new THREE.NumberKeyframeTrack("RotaryGroup.rotation[y]", rotationTimes, rotationValues);
    
    // Auger vertical movement
    const moveTimes = [0, drillDuration / 2, drillDuration];
    const moveValues = [9, 2, 9];
    const moveTrack = new THREE.NumberKeyframeTrack("RotaryGroup.position[y]", moveTimes, moveValues);

    const drillClip = new THREE.AnimationClip("Drill", drillDuration, [rotationTrack, moveTrack]);
    animationClips.push(drillClip);

    return { group, animationClips };
}
