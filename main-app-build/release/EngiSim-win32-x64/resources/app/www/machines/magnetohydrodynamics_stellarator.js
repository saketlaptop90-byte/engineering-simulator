export function createStellarator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stellarator has twisted coils
    const coilCount = 20;
    const coilMat = new THREE.MeshStandardMaterial({ color: 0x2222aa });
    for (let i = 0; i < coilCount; i++) {
        const angle = (i / coilCount) * Math.PI * 2;
        const radius = 6;
        
        const coilGeo = new THREE.TorusGeometry(2, 0.4, 16, 32);
        const coil = new THREE.Mesh(coilGeo, coilMat);
        
        coil.position.x = Math.cos(angle) * radius;
        coil.position.z = Math.sin(angle) * radius;
        
        coil.rotation.y = -angle;
        coil.rotation.x = Math.sin(angle * 5) * 0.5; // twist
        
        group.add(coil);
    }

    // Plasma stream (twisted)
    class TwistedCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const r = 6;
            const a = t * Math.PI * 2;
            const x = Math.cos(a) * r;
            const y = Math.sin(a * 5) * 0.5; // twist
            const z = Math.sin(a) * r;
            return optionalTarget.set(x, y, z);
        }
    }
    const path = new TwistedCurve();
    const plasmaGeo = new THREE.TubeGeometry(path, 100, 0.6, 16, true);
    const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xaa00ff, emissive: 0xaa00ff, emissiveIntensity: 2, transparent: true, opacity: 0.7 });
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    group.add(plasma);

    // Animation
    const times = [0, 5];
    const values = [0, 0, 0, 0, Math.PI * 2, 0];
    const track = new THREE.VectorKeyframeTrack(`${group.uuid}.rotation`, times, values);
    const clip = new THREE.AnimationClip('rotate_stellarator', -1, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
