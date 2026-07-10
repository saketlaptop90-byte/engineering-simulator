import * as THREE from 'three';

export function createBerylliumElectronDensity(scene, renderer, camera) {
    const group = new THREE.Group();

    // Represent density using a smooth volumetric aura
    // Inner core very bright, outer core faint but large.

    const innerGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const outerGeo = new THREE.SphereGeometry(5.0, 64, 64);

    const createGlowMaterial = (color, intensity, exponent) => {
        return new THREE.ShaderMaterial({
            uniforms: {
                c: { value: intensity },
                p: { value: exponent },
                glowColor: { value: new THREE.Color(color) },
                viewVector: { value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normalMatrix * normal);
                    vec3 vNormel = normalize(normalMatrix * viewVector);
                    intensity = pow(1.0 - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, intensity);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false
        });
    };

    const innerMat = createGlowMaterial(0xff00ff, 1.5, 3.0);
    const outerMat = createGlowMaterial(0x0044ff, 0.5, 2.5);

    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);

    group.add(innerMesh);
    group.add(outerMesh);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            
            // Pulsing effect
            innerMesh.scale.setScalar(1.0 + Math.sin(time * 3) * 0.05);
            outerMesh.scale.setScalar(1.0 + Math.cos(time * 2) * 0.05);
            
            // Update view vector for fresnel glow
            innerMat.uniforms.viewVector.value = camera.position;
            outerMat.uniforms.viewVector.value = camera.position;
        },
        cleanup: () => {
            innerGeo.dispose();
            outerGeo.dispose();
            innerMat.dispose();
            outerMat.dispose();
            nucleus.geometry.dispose();
            nucleus.material.dispose();
        }
    };
}