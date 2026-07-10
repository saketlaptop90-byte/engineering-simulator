import { copper, darkSteel, gold, aluminum } from '../utils/materials.js';

export function createStellaratorCoil(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Complex twisted coils configuration
    const numCoils = 10;
    const majorRadius = 8;
    const minorRadius = 3;

    const coilGroup = new THREE.Group();

    for (let i = 0; i < numCoils; i++) {
        const angle = (i / numCoils) * Math.PI * 2;
        
        // Define a custom twisted path for each coil
        class CustomCoilCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const u = t * Math.PI * 2;
                // Deformed modular shape characteristic of stellarators
                const x = Math.cos(u) * (minorRadius + Math.sin(u * 2) * 0.5);
                const y = Math.sin(u) * minorRadius;
                const z = Math.cos(u * 3) * 0.5;
                return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
            }
        }
        
        const path = new CustomCoilCurve(1);
        const coilGeo = new THREE.TubeGeometry(path, 64, 0.4, 16, true);
        const coil = new THREE.Mesh(coilGeo, gold);
        
        coil.position.set(majorRadius * Math.cos(angle), 0, majorRadius * Math.sin(angle));
        coil.lookAt(0, 0, 0);
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // Plasma core
    const plasmaGeo = new THREE.TorusGeometry(majorRadius, minorRadius - 0.5, 32, 100);
    const plasmaMat = new THREE.MeshBasicMaterial({ color: 0xaa00ff, transparent: true, opacity: 0.5 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.name = 'PlasmaCore';
    plasma.rotation.x = Math.PI / 2;
    group.add(plasma);

    // Support structure
    const supportGeo = new THREE.CylinderGeometry(majorRadius + 2, majorRadius + 2, 2, 64, 1, true);
    const supportMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide, metalness: 0.6 });
    const support = new THREE.Mesh(supportGeo, darkSteel || supportMat);
    group.add(support);

    // Animation: Rotating plasma and opacity pulsation
    const times = [0, 2.5, 5];
    
    // Quaternion track for smooth plasma flow/rotation
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, Math.PI * 2));
    const quats = [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w];
    const plasmaRotTrack = new THREE.QuaternionKeyframeTrack('PlasmaCore.quaternion', times, quats);
    
    const opacities = [0.3, 0.7, 0.3];
    const plasmaOpacityTrack = new THREE.NumberKeyframeTrack('PlasmaCore.material.opacity', times, opacities);

    const clip = new THREE.AnimationClip('StellaratorRun', 5, [plasmaRotTrack, plasmaOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
