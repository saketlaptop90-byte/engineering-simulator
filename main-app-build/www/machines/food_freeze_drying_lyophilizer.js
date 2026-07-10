import { materials } from '../utils/materials.js';

export function createFreezeDryingLyophilizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(3, 4, 3);
    const body = new THREE.Mesh(bodyGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
    body.position.y = 2;
    group.add(body);

    // Chamber Door
    const doorGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const door = new THREE.Mesh(doorGeo, materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true, color: 0x88ccff }));
    door.rotation.x = Math.PI / 2;
    door.position.set(0, 2, 1.55);
    door.name = "chamberDoor";
    group.add(door);

    // Shelves inside
    for (let i = 0; i < 4; i++) {
        const shelfGeo = new THREE.BoxGeometry(1.8, 0.05, 1.8);
        const shelf = new THREE.Mesh(shelfGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
        shelf.position.set(0, 1.2 + i * 0.5, 0.5);
        group.add(shelf);
    }

    // Control Panel
    const panelGeo = new THREE.PlaneGeometry(0.8, 0.5);
    const panel = new THREE.Mesh(panelGeo, new THREE.MeshBasicMaterial({ color: 0x222222 }));
    panel.position.set(0, 3.5, 1.51);
    group.add(panel);

    const screenGeo = new THREE.PlaneGeometry(0.6, 0.3);
    const screen = new THREE.Mesh(screenGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    screen.name = "controlScreen";
    screen.position.set(0, 3.5, 1.52);
    group.add(screen);

    // Animation: Screen pulsing or changing color to represent temp/pressure dropping
    const clip = new THREE.AnimationClip('FreezeDryCycle', 4, [
        new THREE.ColorKeyframeTrack('controlScreen.material.color', [0, 2, 4], [0, 1, 0, 0, 0, 1, 0, 1, 0])
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
