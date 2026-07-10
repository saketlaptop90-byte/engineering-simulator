import { materials } from '../utils/materials.js';

export function createAutomatedBottlingCarousel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Carousel Base
    const baseGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x999999 }));
    base.position.y = 0.25;
    group.add(base);

    // Carousel platform
    const platformGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.2, 32);
    const platform = new THREE.Mesh(platformGeo, materials.plastic || new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    platform.position.y = 0.6;
    platform.name = "carouselPlatform";
    group.add(platform);

    // Bottles
    const bottleGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const bottleMat = materials.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true, roughness: 0, color: 0xffffff });

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bottle = new THREE.Mesh(bottleGeo, bottleMat);
        bottle.position.set(Math.cos(angle) * 2.2, 0.5, Math.sin(angle) * 2.2);
        platform.add(bottle);
    }

    // Filling station
    const stationGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
    const station = new THREE.Mesh(stationGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0x555555 }));
    station.position.set(2.2, 1.5, 0);
    group.add(station);

    const nozzleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
    const nozzle = new THREE.Mesh(nozzleGeo, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    nozzle.position.set(2.2, 1.2, 0);
    nozzle.name = "fillingNozzle";
    group.add(nozzle);

    // Animation
    const clip = new THREE.AnimationClip('CarouselOperation', 8, [
        new THREE.NumberKeyframeTrack('carouselPlatform.rotation[y]', [0, 8], [0, Math.PI * 2]),
        // Nozzle bobbing down to fill
        new THREE.VectorKeyframeTrack('fillingNozzle.position', 
            [0, 0.5, 1, 1.5, 2], 
            [2.2, 1.2, 0,  2.2, 0.9, 0,  2.2, 0.9, 0,  2.2, 1.2, 0,  2.2, 1.2, 0] // Quick dummy bobbing
        )
    ]);
    animationClips.push(clip);

    return { group, animationClips };
}
