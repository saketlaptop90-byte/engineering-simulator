import { materials } from '../utils/materials.js';

export function createContainmentDomeAirLock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const wallMaterial = materials.concrete || new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.9 });
    const doorMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.4 });
    const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // The tunnel / hull
    const tunnelGeom = new THREE.CylinderGeometry(2, 2, 6, 32, 1, true);
    const tunnel = new THREE.Mesh(tunnelGeom, wallMaterial);
    tunnel.rotation.z = Math.PI / 2;
    group.add(tunnel);

    // Outer Door
    const outerDoor = new THREE.Group();
    outerDoor.name = "outerDoor";
    const doorGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    const doorMesh1 = new THREE.Mesh(doorGeom, doorMaterial);
    doorMesh1.rotation.z = Math.PI / 2;
    outerDoor.add(doorMesh1);
    
    // Handwheel
    const wheelGeom = new THREE.TorusGeometry(0.5, 0.05, 8, 16);
    const wheel1 = new THREE.Mesh(wheelGeom, doorMaterial);
    wheel1.rotation.y = Math.PI / 2;
    wheel1.position.x = 0.2;
    outerDoor.add(wheel1);
    
    outerDoor.position.x = -3;
    group.add(outerDoor);

    // Inner Door
    const innerDoor = new THREE.Group();
    innerDoor.name = "innerDoor";
    const doorMesh2 = new THREE.Mesh(doorGeom, doorMaterial);
    doorMesh2.rotation.z = Math.PI / 2;
    innerDoor.add(doorMesh2);
    
    const wheel2 = new THREE.Mesh(wheelGeom, doorMaterial);
    wheel2.rotation.y = Math.PI / 2;
    wheel2.position.x = -0.2;
    innerDoor.add(wheel2);

    innerDoor.position.x = 3;
    group.add(innerDoor);

    // Indicator lights
    const lightGeom = new THREE.SphereGeometry(0.2, 16, 16);
    const outerLight = new THREE.Mesh(lightGeom, indicatorMaterial.clone());
    outerLight.name = "outerLight";
    outerLight.position.set(-3, 2.5, 0);
    group.add(outerLight);

    const innerLight = new THREE.Mesh(lightGeom, indicatorMaterial.clone());
    innerLight.name = "innerLight";
    innerLight.position.set(3, 2.5, 0);
    group.add(innerLight);

    // Animation: Doors opening sequentially (Outer opens, then closes, then Inner opens)
    const times = [0, 2, 4, 6, 8, 10];
    
    // Outer Door opens (slides up)
    const outerY = [0, 4, 4, 0, 0, 0];
    const outerTrack = new THREE.NumberKeyframeTrack('outerDoor.position[y]', times, outerY);
    
    // Inner Door opens
    const innerY = [0, 0, 0, 0, 4, 4];
    const innerTrack = new THREE.NumberKeyframeTrack('innerDoor.position[y]', times, innerY);

    // Colors changing for lights
    const colorTimes = [0, 2, 4, 6, 8, 10];
    const red = [1,0,0];
    const green = [0,1,0];
    
    const outerColor = [...green, ...red, ...red, ...green, ...green, ...green];
    const innerColor = [...red, ...red, ...red, ...red, ...green, ...red];
    
    const outerColorTrack = new THREE.ColorKeyframeTrack('outerLight.material.color', colorTimes, outerColor);
    const innerColorTrack = new THREE.ColorKeyframeTrack('innerLight.material.color', colorTimes, innerColor);

    const clip = new THREE.AnimationClip('AirLockSequence', 10, [outerTrack, innerTrack, outerColorTrack, innerColorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
