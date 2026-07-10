export function createEbola(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Filament path
    class EbolaCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = t * 10 - 5;
            const ty = Math.sin(t * Math.PI * 4) * 1.5;
            const tz = Math.cos(t * Math.PI * 2) * 1.5;
            // Add a hook at the end
            let hookX = 0, hookY = 0;
            if (t > 0.8) {
                const h = (t - 0.8) * 5;
                hookX = -Math.sin(h * Math.PI) * 2;
                hookY = Math.cos(h * Math.PI) * 2 - 2;
            }
            return optionalTarget.set((tx + hookX) * this.scale, (ty + hookY) * this.scale, tz * this.scale);
        }
    }

    const path = new EbolaCurve(0.8);
    const tubularSegments = 64;
    const radialSegments = 16;
    const radius = 0.4;
    const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, false);
    const material = new THREE.MeshStandardMaterial({ color: 0xaa5533, roughness: 0.9, metalness: 0.0 });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // Animation (Wiggle - scale pulsing)
    const scaleTimes = [0, 1, 2];
    const scaleValues = [1, 1, 1, 1.1, 0.9, 1.1, 1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('.scale', scaleTimes, scaleValues);
    const clip = new THREE.AnimationClip('wiggle', 2, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
