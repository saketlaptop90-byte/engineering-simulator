import * as materials from '../utils/materials.js';

export function createCO2Incubator(THREE) {
    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const glass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });

    const group = new THREE.Group();
    group.name = "CO2Incubator";

    // Body
    const bodyGeo = new THREE.BoxGeometry(3, 4, 3);
    const body = new THREE.Mesh(bodyGeo, metal);
    body.position.y = 2;
    group.add(body);

    // Inner Chamber
    const chamberGeo = new THREE.BoxGeometry(2.6, 3.4, 2.8);
    const chamber = new THREE.Mesh(chamberGeo, darkMetal);
    chamber.position.set(0, 2, 0.1);
    group.add(chamber);

    // Glass Door
    const doorGroup = new THREE.Group();
    doorGroup.position.set(-1.3, 2, 1.5); // Hinge position
    doorGroup.name = "GlassDoor";

    const doorGeo = new THREE.BoxGeometry(2.6, 3.4, 0.1);
    const door = new THREE.Mesh(doorGeo, glass);
    door.position.set(1.3, 0, 0); // Offset from hinge
    doorGroup.add(door);

    group.add(doorGroup);

    // Shelf
    const shelfGeo = new THREE.BoxGeometry(2.4, 0.05, 2.4);
    const shelf = new THREE.Mesh(shelfGeo, metal);
    shelf.position.set(0, 2, 0);
    group.add(shelf);

    // Animations: Door opening
    const times = [0, 2, 4];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 2, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const doorTrack = new THREE.QuaternionKeyframeTrack(doorGroup.name + '.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const openDoorClip = new THREE.AnimationClip("OpenDoor", 4, [doorTrack]);

    return { group, animationClips: [openDoorClip] };
}
