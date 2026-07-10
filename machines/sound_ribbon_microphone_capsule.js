import * as materials from '../utils/materials.js';

export function createRibbonMicrophoneCapsule(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Magnets
    const magnetGeo = new THREE.BoxGeometry(0.5, 3, 1);
    const magnetMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
    
    const magnetLeft = new THREE.Mesh(magnetGeo, magnetMat);
    magnetLeft.position.set(-0.6, 0, 0);
    group.add(magnetLeft);

    const magnetRight = new THREE.Mesh(magnetGeo, magnetMat);
    magnetRight.position.set(0.6, 0, 0);
    group.add(magnetRight);

    // Corrugated Ribbon
    const ribbonGeo = new THREE.PlaneGeometry(0.4, 2.8, 1, 20);
    
    // Deform ribbon to be corrugated
    const posAttribute = ribbonGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        const z = Math.sin(y * 20) * 0.05;
        posAttribute.setZ(i, z);
    }
    ribbonGeo.computeVertexNormals();

    const ribbonMat = materials.shinyMetal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1, roughness: 0.2, side: THREE.DoubleSide });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    group.add(ribbon);

    // Mounts
    const mountGeo = new THREE.BoxGeometry(1.5, 0.2, 0.5);
    const mountMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6 });
    const mountTop = new THREE.Mesh(mountGeo, mountMat);
    mountTop.position.set(0, 1.5, 0);
    group.add(mountTop);
    
    const mountBottom = new THREE.Mesh(mountGeo, mountMat);
    mountBottom.position.set(0, -1.5, 0);
    group.add(mountBottom);

    // Animation: Ribbon vibrating
    const times = [0, 0.05, 0.1, 0.15, 0.2];
    const values = [0, 0.1, -0.1, 0.05, 0];
    const track = new THREE.NumberKeyframeTrack(`${ribbon.uuid}.position[z]`, times, values);
    const clip = new THREE.AnimationClip('ribbon_vibrate', 0.2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
