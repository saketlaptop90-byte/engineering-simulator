import * as materials from '../utils/materials.js';

export function createProgressiveCavityPump(THREE) {
    const group = new THREE.Group();
    group.name = "ProgressiveCavityPump";

    const statorMat = materials.glassMaterial || new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const rotorMat = materials.metalMaterial || materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const couplingMat = materials.darkMaterial || materials.dark || new THREE.MeshStandardMaterial({ color: 0x222222 });

    // Stator (Outer casing, made transparent)
    const statorGeo = new THREE.CylinderGeometry(1.5, 1.5, 10, 32);
    const stator = new THREE.Mesh(statorGeo, statorMat);
    group.add(stator);

    // Rotor (Helical)
    class HelixCurve extends THREE.Curve {
        constructor(scale, radius, turns, height) {
            super();
            this.scale = scale;
            this.radius = radius;
            this.turns = turns;
            this.height = height;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const x = this.radius * Math.cos(t * Math.PI * 2 * this.turns);
            const z = this.radius * Math.sin(t * Math.PI * 2 * this.turns);
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    // A typical PCP has a single-lobe rotor
    const path = new HelixCurve(1, 0.4, 4, 10);
    const rotorGeo = new THREE.TubeGeometry(path, 128, 0.6, 16, false);
    
    // Rotor assembly to handle eccentric rotation
    const rotorAssembly = new THREE.Group();
    rotorAssembly.name = "pcpRotorAssembly";
    group.add(rotorAssembly);
    
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotorAssembly.add(rotor);

    // Top Coupling
    const topCoupling = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 16), couplingMat);
    topCoupling.position.y = 6;
    group.add(topCoupling);

    // Animation: Rotor eccentric rotation
    const times = [0, 0.5, 1, 1.5, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 3*Math.PI/2);
    const q5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2*Math.PI);

    const rotTrack = new THREE.QuaternionKeyframeTrack('pcpRotorAssembly.quaternion', times, [
        ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray(), ...q5.toArray()
    ]);

    // Eccentric offset translation
    const offset = 0.2;
    const pos = [
        offset, 0, 0,
        0, 0, offset,
        -offset, 0, 0,
        0, 0, -offset,
        offset, 0, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack('pcpRotorAssembly.position', times, pos);

    const clip = new THREE.AnimationClip('PCP_Pumping', 2, [rotTrack, posTrack]);

    return { group, animationClips: [clip] };
}
