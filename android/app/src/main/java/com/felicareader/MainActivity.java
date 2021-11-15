package com.felicareader;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  private static Activity mCurrentActivity = null;

  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    mCurrentActivity = this;
  }

  public static Activity getActivity() {
    return mCurrentActivity;
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "FelicaReader";
  }
}
