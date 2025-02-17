#include simplexNoise4d.glsl
attribute vec3 tangent;

float getBlob(vec3 position) {
    vec3 wrappedPosition = position;
    wrappedPosition += simplexNoise4d(vec4(position * 1.0 , 1.0 * 0.5)) * 0.3;
    return simplexNoise4d(vec4(wrappedPosition * 1.0 , 1.0 * 0.2)) * 0.5;
}

void main(){
    vec3 biTangent = cross(tangent.xyz , normal);
    float shift = 0.07;
    vec3 A = csm_Position + shift * tangent.xyz;
    vec3 B = csm_Position + shift * biTangent;

    float blob = getBlob(csm_Position);
    csm_Position += blob * normal;

    A += getBlob(A) * normal;
    B += getBlob(B) * normal;

    vec3 shadowA = normalize(A - csm_Position);
    vec3 shadowB = normalize(B - csm_Position);

    csm_Normal = -cross(shadowA , shadowB);
}