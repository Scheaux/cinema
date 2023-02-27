<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Hall;
use Illuminate\Http\Request;

class HallController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Hall::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        Hall::makeNewHall($request->all());

        return Hall::all();
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Hall  $hall
     * @return \Illuminate\Http\Response
     */
    public function show(Hall $hall)
    {
        return $hall;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Hall  $hall
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Hall $hall)
    {
        $hall->update($request->all());
        if ($request['seats']) {
            Booking::where('hallId', $hall->id)->update(['seats' => $request['seats']]);
        }
        return $hall;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Hall  $hall
     * @return \Illuminate\Http\Response
     */
    public function destroy(Hall $hall)
    {
        $hall->delete();
        return Hall::all();
    }

    public function activateHalls()
    {
        Hall::where('is_active', false)->update(['is_active' => true]);

        return response('', 204);
    }

    public function deactivateHalls()
    {
        Hall::where('is_active', true)->update(['is_active' => false]);

        return response('', 204);
    }
}
