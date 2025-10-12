<?php

it('returns ok for healthz', function () {
    $response = $this->getJson('/api/healthz');

    $response->assertStatus(200);
});
