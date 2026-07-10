export function createFiberOpticNetwork(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const coreMat = new THREE.MeshStandardMaterial({ color: 0xaaccff, transparent: true, opacity: 0.8, metalness: 0.2, roughness: 0.1 });
    const claddingMat = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.3, metalness: 0.5, roughness: 0.6 });
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.3, roughness: 0.8 });

    const hubGeo = new THREE.BoxGeometry(2, 1, 2);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.5 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.position.set(0, 0.5, 0);
    group.add(hub);

    const numFibers = 6;
    for (let i = 0; i < numFibers; i++) {
        const angle = (i / numFibers) * Math.PI * 2;
        const fiberGroup = new THREE.Group();
        
        class FiberCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = t * 5;
                const ty = Math.sin(t * Math.PI) * 1.5;
                const tz = 0;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        const path = new FiberCurve(1);
        const jacketGeo = new THREE.TubeGeometry(path, 20, 0.2, 8, false);
        const jacket = new THREE.Mesh(jacketGeo, jacketMat);
        fiberGroup.add(jacket);

        class CladdingCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = (t * 2) + 5;
                const ty = 0;
                const tz = 0;
                return optionalTarget.set(tx, ty, tz);
            }
        }
        
        const cladGeo = new THREE.TubeGeometry(new CladdingCurve(), 10, 0.12, 8, false);
        const cladding = new THREE.Mesh(cladGeo, claddingMat);
        fiberGroup.add(cladding);

        class CoreCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = (t * 1) + 7;
                const ty = 0;
                const tz = 0;
                return optionalTarget.set(tx, ty, tz);
            }
        }
        
        const corGeo = new THREE.TubeGeometry(new CoreCurve(), 10, 0.05, 8, false);
        const core = new THREE.Mesh(corGeo, coreMat);
        fiberGroup.add(core);

        const pulseGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.position.set(7.5, 0, 0);
        fiberGroup.add(pulse);

        fiberGroup.rotation.y = angle;
        fiberGroup.position.set(0, 0.5, 0);
        group.add(fiberGroup);
    }

    return { group, animationClips };
}
