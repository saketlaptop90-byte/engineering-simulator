import { materials } from '../utils/materials.js';

export function createRotaryLabeler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4, metalness: 0.6 });
    const matDark = materials?.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const matGlass = materials?.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });
    
    // Base platform
    const baseGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const base = new THREE.Mesh(baseGeo, matDark);
    base.position.y = 0.5;
    group.add(base);

    // Rotating Carousel
    const carousel = new THREE.Group();
    carousel.position.y = 1.2;
    carousel.name = 'Carousel';
    group.add(carousel);

    const carouselPlateGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const carouselPlate = new THREE.Mesh(carouselPlateGeo, matMetal);
    carousel.add(carouselPlate);

    const centerPillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const centerPillar = new THREE.Mesh(centerPillarGeo, matMetal);
    centerPillar.position.y = 1;
    carousel.add(centerPillar);

    const topPlateGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
    const topPlate = new THREE.Mesh(topPlateGeo, matMetal);
    topPlate.position.y = 2;
    carousel.add(topPlate);

    // Add bottles
    const numBottles = 8;
    for (let i = 0; i < numBottles; i++) {
        const angle = (i / numBottles) * Math.PI * 2;
        const bottleGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 16);
        const bottle = new THREE.Mesh(bottleGeo, matGlass);
        bottle.position.set(Math.cos(angle) * 1.4, 0.5, Math.sin(angle) * 1.4);
        carousel.add(bottle);
    }

    // Label dispenser
    const dispenserGeo = new THREE.BoxGeometry(1, 1.5, 0.8);
    const dispenser = new THREE.Mesh(dispenserGeo, matMetal);
    dispenser.position.set(2.5, 1.5, 0);
    group.add(dispenser);

    // Carousel rotation animation
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);

    const rotTrack = new THREE.QuaternionKeyframeTrack(
        'Carousel.quaternion',
        [0, 1, 2],
        [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ]
    );

    const clip = new THREE.AnimationClip('CarouselRotate', 2, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
