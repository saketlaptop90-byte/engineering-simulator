import { materials } from '../utils/materials.js';

export function createSubglacialGeyserSampler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main chassis
    const chassisGeo = new THREE.BoxGeometry(1, 1, 1);
    const chassis = new THREE.Mesh(chassisGeo, materials.aluminum || new THREE.MeshStandardMaterial({color: 0xbbbbbb}));
    group.add(chassis);

    // Funnel / Collector
    const funnelGeo = new THREE.ConeGeometry(0.8, 1, 16, 1, true);
    const funnel = new THREE.Mesh(funnelGeo, materials.titanium || new THREE.MeshStandardMaterial({color: 0x888888, side: THREE.DoubleSide}));
    funnel.rotation.x = Math.PI;
    funnel.position.y = -1;
    group.add(funnel);

    // Sample vials (carousel)
    const carousel = new THREE.Group();
    for(let i=0; i<6; i++) {
        const vialGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
        const vial = new THREE.Mesh(vialGeo, materials.glass || new THREE.MeshStandardMaterial({color: 0xccffff, transparent: true, opacity: 0.6}));
        const angle = i * (Math.PI * 2 / 6);
        vial.position.x = Math.cos(angle) * 0.3;
        vial.position.z = Math.sin(angle) * 0.3;
        vial.position.y = 0.8;
        carousel.add(vial);
    }
    group.add(carousel);

    // Animation: Carousel rotating to next vial
    const times = [0, 1, 2, 3, 4, 5, 6];
    const qValues = [];
    for(let i=0; i<=6; i++) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), i * (Math.PI * 2 / 6));
        qValues.push(q.x, q.y, q.z, q.w);
    }
    const carouselTrack = new THREE.QuaternionKeyframeTrack(`${carousel.uuid}.quaternion`, times, qValues);
    
    const clip = new THREE.AnimationClip('SampleCollection', 6, [carouselTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
