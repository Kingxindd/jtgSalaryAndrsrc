package com.jtgsalaryapp;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;

import cn.jpush.android.api.JPushInterface;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "jtgSalaryApp";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.setDebugMode(true);
        JPushInterface.init(this);
        //Bundle b = getIntent().getExtras();
        //String title = b.getString(JPushInterface.EXTRA_REGISTRATION_ID);
        //Log.d("MainActivity", "reg id is:" + title);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }
}
