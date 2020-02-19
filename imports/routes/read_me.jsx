import React from "react";
import { Link } from "react-router-dom";

const ReadMe = () => (
  <div id="readMe" className="fadeIn container">
    <h3>What is this?</h3>
    <p>
      It&apos;s not uncommon for railfans to record train movements, but that
      data is scattered, and it can be hard to find any meaningful patterns by
      looking at a list of raw data. Foambook is intended to provide a
      centralized place to keep those notes, and to provide a way to quickly see
      when a train might be at a particular location.
    </p>
    <p>
      To sign up, click the &quot;Sign in with Google&quot; button in the upper
      right corner, then check your email for the verification email.
    </p>
    <p>
      To speed up the process of filling out the submission form, you can set
      default values for 4 of the 5 fields. These options are available on{" "}
      <Link to="/user_profile">your profile page</Link>.
    </p>
    <p>
      Notes you submit are not stuck here, either. There is a button at the
      bottom of the <Link to="/user_profile">profile page</Link> that allows you
      to download all your notes as an xlsx spreadsheet.
    </p>
    <h3>When submitting notes:</h3>
    <ul id="readMeLis">
      <li>Date must be within the last five years.</li>
      <li>Times are entered using a 24-hour clock format.</li>
      <li>
        Location should be either a city or a timetable location. All
        punctuation will be removed, only letters and spaces are kept.
      </li>
      <li>States/Provinces use two-letter abbrevations.</li>
      <li>
        Currently supported railroads are BNSF, CN, CP, CSX, KCS, NS, PAR/PAS,
        and UP. This is because the train symbols have to be validated.
      </li>
      <li>
        Only road and local train symbols are supported, miscellaneous things
        like yard jobs are not. Further, only the base symbols (and applicable
        section codes) are supported, additional info like date codes are not.
        For example, UP&apos;s MFWWC and MFWWCB (second section of the MFWWC)
        are okay, but MFWWCB-24 is not.
      </li>
      <li>
        When you submit a note for a new location/railroad/symbol, it can take a
        few minutes to show up in the search menu. You can still view it and add
        comments by clicking on the entry in the table underneath the submission
        form.
      </li>
    </ul>
    <h3>To include additional information:</h3>
    <p>
      Select the location & train from the search menu. Underneath the chart
      there is section where you can add comments. This is intended for{" "}
      <strong>general</strong> information about what that train does at that
      location. Please be mindful about what you put here and
      <strong> do not include any sensitive information.</strong>
    </p>
    <h3>If you find an incorrect/inappropriate note or comment:</h3>
    <p>
      Click the orange flag icon <span className="glyphicon glyphicon-flag" />{" "}
      by the note/comment and a form will pop up. Please include a brief
      description of the problem. Your comments here will not be publicly
      visible. The problem note/comment will then be reviewed and deleted if
      necessary.
    </p>
    <h3>Privacy:</h3>
    <p>
      When you create an account here, the only information that is collected is
      your public google profile (email, name, profile picture, and language).
      Google also provides an ID and access token specific to this app to use
      for authentication - that way, no passwords are involved.
    </p>
    <h3>Feedback:</h3>
    <p>
      If you experience any bugs or have any input, please let me know either by
      submitting an issue at
      <a href="https://github.com/qualitymanifest/foambook">
        {" "}
        the github repo{" "}
      </a>
      or by sending an email to qualityfiltering@gmail.com
    </p>
  </div>
);

export default ReadMe;
