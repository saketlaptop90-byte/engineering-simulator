import * as materials from '../utils/materials.js';

export function createInductionHeatingCoil(THREE) {
    const group = new THREE.Group();
    group.name = 'InductionHeatingCoil';
    const animationClips = [];

    // Base Mount
    const baseGeo = new THREE.BoxGeometry(2, 0.5, 2);
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.8});
    const base = new THREE.Mesh(baseGeo, darkMetal);
    base.position.y = 0.25;
    group.add(base);

    // Copper Coil
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = 2 * Math.PI * this.turns * t;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);
            const y = this.height * t;
            return optionalTarget.set(x, y, z);
        }
    }

    const path = new HelixCurve(1, 4, 5);
    const coilGeo = new THREE.TubeGeometry(path, 100, 0.15, 8, false);
    const copperMat = materials.copper || new THREE.MeshStandardMaterial({color: 0xb87333, metalness: 0.9, roughness: 0.2});
    const coil = new THREE.Mesh(coilGeo, copperMat);
    coil.position.y = 0.5;
    group.add(coil);

    // Billet
    const billetGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 32);
    const billetMat = new THREE.MeshStandardMaterial({color: 0x333333, emissive: 0x000000, metalness: 0.6});
    const billet = new THREE.Mesh(billetGeo, billetMat);
    billet.position.y = 2.5;
    billet.name = 'Billet';
    group.add(billet);

    // Animation
    const duration = 5;
    const times = [0, 2.5, 5];
    
    const colors = [
        0, 0, 0,
        1, 0.2, 0,
        0, 0, 0
    ];
    
    const emissiveTrack = new THREE.ColorKeyframeTrack('Billet.material.emissive', times, colors);

    const clip = new THREE.AnimationClip('HeatCycle', duration, [emissiveTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
