import React from 'react';
import './App.css';
import {observer} from "mobx-react";
import {makeObservable, observable, runInAction, action} from "mobx";
import { JournalReader, JournalReaderMachine } from './JournalReader';
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import { JournalWriter, JournalWriterMachine } from './JournalWriter';
import { MarkupUtils } from './MarkupUtils';

export class AppMachine
{
  @observable testData: any = null;

  public journalReaderMachine: JournalReaderMachine = new JournalReaderMachine();
  public journalWriterMachine: JournalWriterMachine = new JournalWriterMachine();

  @observable public selectedFile: any | null = null;

  constructor()
  {
    makeObservable(this);
  }

  public handleEasyMarkupGeneratorSubmit = (): void => {
    document.getElementById("firstName");
    const firstName: string | null = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName: string = (document.getElementById("lastName") as HTMLInputElement).value;
    const displayName: string = (document.getElementById("displayName") as HTMLInputElement).value;

    const currentMarkupHack = MarkupUtils.makeMarkup(firstName, lastName, displayName);
    (document.getElementById("placeToSelectText") as HTMLInputElement).value = currentMarkupHack;

    var copyText = document.getElementById("displayCopyArea") as HTMLElement;
    // this.selectElementContents(copyText);
    document.execCommand("copy");

    (document.getElementById("firstName") as HTMLInputElement).value = "";
    (document.getElementById("firstName") as HTMLInputElement).focus();
    (document.getElementById("lastName") as HTMLInputElement).value = "";
    (document.getElementById("displayName") as HTMLInputElement).value = "";
  };
}

export interface AppProps
{

}

@observer
class App extends React.Component<AppProps>
{
  private machine: AppMachine = new AppMachine();

  private async getFullNameForDisplayName(): Promise<void>
  {
    const raw = await fetch('/api/displayName/dirk');
    const fullNames = await raw.json();

    console.log(fullNames);
  }

  private async addDisplayName(): Promise<void>
  {
    const data = {
      displayname: "dirk",
      firstname: "dirk2",
      lastname: "stahlecker2"
    };

    const testDataRaw = await fetch('/api/displayName/add', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      // mode: 'cors', // no-cors, *cors, same-origin
      // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // redirect: 'follow', // manual, *follow, error
      // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const td = await testDataRaw.json();

    // runInAction(() => this.machine.testData = JSON.stringify(td));
  }

  private async fetchAllDbData(): Promise<void>
  {
    const testDataRaw = await fetch('/api/displayName/all');
    const td = await testDataRaw.json();

    runInAction(() => this.machine.testData = JSON.stringify(td));
  }

  componentDidMount()
  {
    // this.fetchData();
  }

  onFileChange = (e: any) => { //TODO
    // this.setState({ selectedFile: event.target.files[0] });
    this.machine.selectedFile = e.target.files[0];
  }; 

  onFileUpload = async(): Promise<void> => { 
    // const formData = new FormData(); 
    // formData.append( 
    //   "myFile", 
    //   this.state.selectedFile, 
    //   this.state.selectedFile.name 
    // ); 
    // axios.post("api/uploadfile", formData); 

    // const requestOptions = {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({name: this.machine.selectedFile.name, file: this.machine.selectedFile})
    // }

    // await fetch('/journal/upload', requestOptions);
    // console.log("")


    const formData = new FormData()
    formData.append('file', this.machine.selectedFile)
    console.log(this.machine.selectedFile)
  
    fetch('/journal/upload', {
      method: 'POST',
      body: formData,
      // headers: {'content-type': 'application/json'},
      // headers: {'Content-Type': 'multipart/form-data'}
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }; 

  render()
  {
    return <div className="App">
      <span style={{width: "100%", height: "100%", display: "inline-block", verticalAlign: "top"}}
            tabIndex={0}
            id="mainApp"
      >
        <Tabs>
          <TabList>
            <Tab>
              Test
            </Tab>
            <Tab>
              Upload
            </Tab>
            <Tab>
              Write
            </Tab>
            <Tab>
              Read
            </Tab>
            <Tab>
              Add Markup
            </Tab>
            <Tab>
              Stats
            </Tab>
            <Tab>
              Graph Testing
            </Tab>
          </TabList>

          <TabPanel>
            <button onClick={() => this.getFullNameForDisplayName()}>Test</button>&nbsp;
            <button onClick={() => this.fetchAllDbData()}>Get DB Data</button>
            <br/>
            {
              this.machine.testData != null &&
              this.machine.testData
            }
          </TabPanel>
          <TabPanel>
            <input type="file" name="journal_path" onChange={this.onFileChange}/>
            <button onClick={this.onFileUpload}> Upload! </button>
          </TabPanel>
          <TabPanel>
            <JournalWriter machine={this.machine.journalWriterMachine}/>
          </TabPanel>
          <TabPanel>
            <JournalReader machine={this.machine.journalReaderMachine}/>
          </TabPanel>
          <TabPanel>
            <div onKeyDown={(e: any) => {
              if (e.key === "Enter")
              {
                e.preventDefault();
                this.machine.handleEasyMarkupGeneratorSubmit();
              }
            }}>
              First Name: <input type="text" id="firstName" autoFocus={true}/>
              <br />
              Last Name: <input type="text" id="lastName" />
              <br />
              Display Name: <input type="text" id="displayName" />
              <br />
              <button onClick={this.machine.handleEasyMarkupGeneratorSubmit}>Submit</button>
              <br />
              <br />
              <div id="displayCopyArea">
                <input id="placeToSelectText" />
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            {/* <Stats
              machine={new StatsMachine("TODO")}
            /> */}
          </TabPanel>
          <TabPanel>

          </TabPanel>
        </Tabs>

      </span>
    </div>
  }
}

export default App;
